
DROP POLICY IF EXISTS "Authenticated users can view tripsheets" ON public.tripsheets;
CREATE POLICY "Anyone can view tripsheets" ON public.tripsheets FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.tripsheets TO anon;
