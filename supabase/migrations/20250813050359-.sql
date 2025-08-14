-- Create enums using DO blocks to avoid errors if they exist
DO $$ BEGIN
  CREATE TYPE public.app_department AS ENUM ('engineer','regional_manager','store_manager','admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.ticket_status AS ENUM ('open','in-progress','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.ticket_priority AS ENUM ('low','medium','high','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Profiles table to store user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  email text,
  mobile text,
  department public.app_department NOT NULL DEFAULT 'engineer',
  zone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for profiles
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dept_text text;
  mapped_dept public.app_department;
BEGIN
  dept_text := lower(NEW.raw_user_meta_data ->> 'department');
  mapped_dept := CASE
    WHEN dept_text IN ('regional manager','regional_manager') THEN 'regional_manager'::public.app_department
    WHEN dept_text IN ('store manager','store_manager') THEN 'store_manager'::public.app_department
    WHEN dept_text = 'admin' THEN 'admin'::public.app_department
    ELSE 'engineer'::public.app_department
  END;

  INSERT INTO public.profiles (id, username, email, mobile, department, zone)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data ->> 'mobile',
    mapped_dept,
    NEW.raw_user_meta_data ->> 'zone'
  );
  RETURN NEW;
END;
$$;

-- Ensure only one trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper to check if user is Regional Manager
CREATE OR REPLACE FUNCTION public.is_regional_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND department = 'regional_manager'
  );
$$;

-- Tickets table for persistent storage
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status public.ticket_status NOT NULL DEFAULT 'open',
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  assignee_id uuid REFERENCES auth.users(id),
  due_date timestamptz,
  tags text[] NOT NULL DEFAULT '{}',
  attachments text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER IF NOT EXISTS update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies for tickets
CREATE POLICY IF NOT EXISTS "Anyone authenticated can view tickets"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can create their own tickets"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own tickets"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Regional managers can delete any ticket"
  ON public.tickets FOR DELETE
  TO authenticated
  USING (public.is_regional_manager(auth.uid()));