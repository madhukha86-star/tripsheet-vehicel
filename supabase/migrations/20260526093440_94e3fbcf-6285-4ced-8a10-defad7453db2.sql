
DROP POLICY "Authenticated users can update tripsheets" ON public.tripsheets;
DROP POLICY "Authenticated users can delete tripsheets" ON public.tripsheets;

CREATE POLICY "Users can update own tripsheets"
  ON public.tripsheets FOR UPDATE TO authenticated
  USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own tripsheets"
  ON public.tripsheets FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
