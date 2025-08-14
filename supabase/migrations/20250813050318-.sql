-- Create enums for departments and tickets
create type if not exists public.app_department as enum ('engineer','regional_manager','store_manager','admin');

create type if not exists public.ticket_status as enum ('open','in-progress','resolved','closed');
create type if not exists public.ticket_priority as enum ('low','medium','high','critical');

-- Profiles table to store user metadata
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  email text,
  mobile text,
  department public.app_department not null default 'engineer',
  zone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Basic RLS policies for profiles
create policy if not exists "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Shared updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger if not exists update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Trigger to create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  dept_text text;
  mapped_dept public.app_department;
begin
  dept_text := lower(new.raw_user_meta_data ->> 'department');
  mapped_dept := case
    when dept_text in ('regional manager','regional_manager') then 'regional_manager'::public.app_department
    when dept_text in ('store manager','store_manager') then 'store_manager'::public.app_department
    when dept_text = 'admin' then 'admin'::public.app_department
    else 'engineer'::public.app_department
  end;

  insert into public.profiles (id, username, email, mobile, department, zone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'mobile',
    mapped_dept,
    new.raw_user_meta_data ->> 'zone'
  );
  return new;
end;
$$;

-- Ensure only one trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper to check if user is Regional Manager
create or replace function public.is_regional_manager(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _user_id and department = 'regional_manager'
  );
$$;

-- Tickets table for persistent storage
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status public.ticket_status not null default 'open',
  priority public.ticket_priority not null default 'medium',
  assignee_id uuid references auth.users(id),
  due_date timestamptz,
  tags text[] not null default '{}',
  attachments text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tickets enable row level security;

create trigger if not exists update_tickets_updated_at
before update on public.tickets
for each row execute function public.update_updated_at_column();

-- RLS policies for tickets
create policy if not exists "Anyone authenticated can view tickets"
  on public.tickets for select
  to authenticated
  using (true);

create policy if not exists "Users can create their own tickets"
  on public.tickets for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own tickets"
  on public.tickets for update
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Regional managers can delete any ticket"
  on public.tickets for delete
  to authenticated
  using (public.is_regional_manager(auth.uid()));