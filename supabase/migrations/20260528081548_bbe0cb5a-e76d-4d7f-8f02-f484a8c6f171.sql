ALTER TABLE public.tripsheets
  ADD COLUMN IF NOT EXISTS grade text,
  ADD COLUMN IF NOT EXISTS issued_by text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS district text;