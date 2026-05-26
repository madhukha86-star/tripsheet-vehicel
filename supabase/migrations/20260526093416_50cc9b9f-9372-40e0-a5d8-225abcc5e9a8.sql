
CREATE TABLE public.tripsheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tripsheet_code TEXT NOT NULL UNIQUE,
  bulk_demand_number TEXT,
  transit_pass_number TEXT,
  vehicle_number TEXT,
  tripsheet_generate_datetime TIMESTAMPTZ,
  lease_validity_ibm_mine_code TEXT,
  lease_name_lease_code TEXT,
  lease_holder_code_name TEXT,
  tahsil_village_syno TEXT,
  transit_pass_purpose TEXT,
  issue_date DATE,
  buyer_name_parcel_no TEXT,
  buyer_name TEXT,
  address TEXT,
  destination_address TEXT,
  distance TEXT,
  route TEXT,
  route_destination TEXT,
  mineral_name_grade TEXT,
  net_weight_mt NUMERIC,
  mode_of_transport TEXT,
  transporter_name TEXT,
  driver_name_licence_no TEXT,
  journey_start_date TIMESTAMPTZ,
  weigh_bridge_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tripsheets_code ON public.tripsheets(tripsheet_code);

ALTER TABLE public.tripsheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view tripsheets"
  ON public.tripsheets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tripsheets"
  ON public.tripsheets FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update tripsheets"
  ON public.tripsheets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete tripsheets"
  ON public.tripsheets FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_tripsheets_updated_at
  BEFORE UPDATE ON public.tripsheets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
