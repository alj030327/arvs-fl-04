-- Drop the complex token policy and replace with a simpler, more secure approach
DROP POLICY IF EXISTS "View signing request with valid token" ON public.signing_requests;
DROP POLICY IF EXISTS "Update signing request with valid token" ON public.signing_requests;

-- Only allow users to view their own signing requests when authenticated
-- This removes the security vulnerability while maintaining functionality for authenticated users
CREATE POLICY "Users can view their own signing requests only" 
ON public.signing_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to update only their own signing requests
CREATE POLICY "Users can update their own signing requests"
ON public.signing_requests
FOR UPDATE
USING (auth.uid() = user_id);