-- First, create the tables
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_settings (
  id uuid references auth.users on delete cascade not null primary key,
  theme text default 'system'::text not null,
  email_notifications boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

-- Create security policies
create policy if not exists "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy if not exists "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = id);

create policy if not exists "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = id);

-- Create trigger functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  
  insert into public.user_settings (id)
  values (new.id);
  
  return new;
end;
$$;

create or replace function public.handle_user_deletion()
returns trigger
language plpgsql
security definer
as $$
begin
  delete from public.user_settings where id = old.id;
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  before delete on auth.users
  for each row execute procedure public.handle_user_deletion();

drop trigger if exists handle_updated_at on public.profiles;
create trigger handle_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at on public.user_settings;
create trigger handle_updated_at
  before update on public.user_settings
  for each row execute procedure public.handle_updated_at(); 