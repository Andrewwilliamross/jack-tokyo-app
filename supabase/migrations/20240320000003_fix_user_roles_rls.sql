
-- Fix RLS policies on user_roles table to allow signup
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;

-- Create new policies that allow signup while maintaining security
CREATE POLICY "Users can view their own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Allow INSERT for new user creation (this is what was blocking signup)
CREATE POLICY "Allow signup role creation"
    ON public.user_roles FOR INSERT
    WITH CHECK (true);

-- Only admins can update existing roles
CREATE POLICY "Only admins can update roles"
    ON public.user_roles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can delete roles
CREATE POLICY "Only admins can delete roles"
    ON public.user_roles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
