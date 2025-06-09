-- Create the media storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Function to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(user_email TEXT)
RETURNS void AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO new_user_id
    FROM auth.users
    WHERE email = user_email;

    -- If user exists, make them an admin
    IF new_user_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (new_user_id, 'admin')
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'admin';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user_roles entry for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role
        FROM user_roles
        WHERE user_roles.user_id = get_user_role.user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS boolean AS $$
BEGIN
    RETURN (
        SELECT role = 'admin'
        FROM user_roles
        WHERE user_roles.user_id = is_admin.user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 