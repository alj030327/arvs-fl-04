-- Create orders table to track payments and estate processing
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,           -- Amount in öre (200 kr = 20000 öre)
  currency TEXT NOT NULL DEFAULT 'sek',
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, paid, completed, failed
  package_type TEXT NOT NULL DEFAULT 'baspaket',
  estate_data JSONB,                 -- Store the estate processing data
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Enable Row-Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT
USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Users can create orders" ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id OR true);  -- Allow guest orders

CREATE POLICY "System can update orders" ON public.orders
FOR UPDATE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();