-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_settings table for user preferences
create table public.user_settings (
  id uuid references auth.users on delete cascade not null primary key,
  theme text default 'system'::text not null,
  email_notifications boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create policies for user_settings
create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = id);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into profiles
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  -- Insert into user_settings
  insert into public.user_settings (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to handle user deletion
create or replace function public.handle_user_deletion()
returns trigger as $$
begin
  -- Delete from user_settings
  delete from public.user_settings where id = old.id;
  -- Delete from profiles
  delete from public.profiles where id = old.id;
  return old;
end;
$$ language plpgsql security definer;

-- Create trigger for user deletion
create trigger on_auth_user_deleted
  before delete on auth.users
  for each row execute procedure public.handle_user_deletion();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers for updated_at
create trigger handle_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_settings
  for each row execute procedure public.handle_updated_at(); 