-- Remove the overly permissive policy that allows anyone to view all signing requests
DROP POLICY IF EXISTS "Anyone can view signing requests by token" ON public.signing_requests;

-- Remove redundant policies to clean up the security model
DROP POLICY IF EXISTS "Authenticated users can create signing requests" ON public.signing_requests;
DROP POLICY IF EXISTS "Authenticated users can update signing requests" ON public.signing_requests;

-- Create a secure token-based access policy that only allows viewing a specific signing request with the correct token
CREATE POLICY "View signing request with valid token" 
ON public.signing_requests 
FOR SELECT 
USING (
  -- Only allow access if a specific token is provided and matches
  -- This will be used through application logic that passes the token as a parameter
  EXISTS (
    SELECT 1 FROM public.signing_requests sr 
    WHERE sr.id = signing_requests.id 
    AND sr.token = current_setting('request.jwt.claims', true)::json->>'token'
  )
);

-- Allow authenticated users to update signing requests they have access to via token
CREATE POLICY "Update signing request with valid token"
ON public.signing_requests
FOR UPDATE
USING (
  -- Allow updates only if user has access via token OR is the owner
  (auth.uid() = user_id) OR
  EXISTS (
    SELECT 1 FROM public.signing_requests sr 
    WHERE sr.id = signing_requests.id 
    AND sr.token = current_setting('request.jwt.claims', true)::json->>'token'
  )
);