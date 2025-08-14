-- Create material_requests table to store all MR and MRC requests
CREATE TABLE public.material_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'MR', -- 'MR' or 'MRC'
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  requested_by TEXT NOT NULL,
  requester_email TEXT,
  requester_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  ticket_number TEXT,
  zone TEXT,
  description TEXT,
  transport_mode TEXT,
  edt TIMESTAMP WITH TIME ZONE,
  tracking_no TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  mrc_number TEXT,
  received_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by_email TEXT
);

-- Enable RLS
ALTER TABLE public.material_requests ENABLE ROW LEVEL SECURITY;

-- Create helper functions for department checks
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

CREATE OR REPLACE FUNCTION public.is_store_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND department = 'store_manager'
  );
$$;

-- Create policies
CREATE POLICY "Anyone authenticated can view material requests" 
ON public.material_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own requests" 
ON public.material_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own requests" 
ON public.material_requests 
FOR UPDATE 
USING (auth.uid() = requester_id);

CREATE POLICY "Regional managers can update any request" 
ON public.material_requests 
FOR UPDATE 
USING (is_regional_manager(auth.uid()));

CREATE POLICY "Store managers can update any request" 
ON public.material_requests 
FOR UPDATE 
USING (is_store_manager(auth.uid()));

CREATE POLICY "Regional managers can delete any request" 
ON public.material_requests 
FOR DELETE 
USING (is_regional_manager(auth.uid()));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_material_requests_updated_at
BEFORE UPDATE ON public.material_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_material_requests_requester_id ON public.material_requests(requester_id);
CREATE INDEX idx_material_requests_status ON public.material_requests(status);
CREATE INDEX idx_material_requests_request_type ON public.material_requests(request_type);