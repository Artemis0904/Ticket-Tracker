-- Create helper to fetch recipient emails by department (optionally filtered by zone)
CREATE OR REPLACE FUNCTION public.get_emails_by_department(
  _department public.app_department,
  _zone text DEFAULT NULL
)
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT email
  FROM public.profiles
  WHERE department = _department
    AND email IS NOT NULL
    AND (_zone IS NULL OR zone = _zone);
$$;