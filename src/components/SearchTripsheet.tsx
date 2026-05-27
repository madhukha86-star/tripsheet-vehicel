import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Search, Download, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { downloadTripsheetPdf } from "@/lib/tripsheet-pdf";
import { TripsheetDetails } from "@/components/TripsheetDetails";

type SearchBy = "tripsheet" | "transit" | "vehicle";

export type Tripsheet = {
  id: string;
  tripsheet_code: string;
  bulk_demand_number: string | null;
  transit_pass_number: string | null;
  vehicle_number: string | null;
  tripsheet_generate_datetime: string | null;
  lease_validity_ibm_mine_code: string | null;
  lease_name_lease_code: string | null;
  lease_holder_code_name: string | null;
  tahsil_village_syno: string | null;
  transit_pass_purpose: string | null;
  issue_date: string | null;
  buyer_name_parcel_no: string | null;
  buyer_name: string | null;
  address: string | null;
  destination_address: string | null;
  distance: string | null;
  route: string | null;
  route_destination: string | null;
  mineral_name_grade: string | null;
  net_weight_mt: number | null;
  mode_of_transport: string | null;
  transporter_name: string | null;
  driver_name_licence_no: string | null;
  journey_start_date: string | null;
  weigh_bridge_name: string | null;
};

export function SearchTripsheet() {
  const [by, setBy] = useState<SearchBy>("tripsheet");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Tripsheet | null>(null);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);

  const label =
    by === "tripsheet" ? "Tripsheet Code" : by === "transit" ? "Transit Pass Number" : "Vehicle Number";

  const search = async () => {
    if (!code.trim()) return toast.error("Please enter a value");
    setBusy(true);
    setSearched(true);
    const column =
      by === "tripsheet" ? "tripsheet_code" : by === "transit" ? "transit_pass_number" : "vehicle_number";
    const { data, error } = await supabase
      .from("tripsheets")
      .select("*")
      .eq(column, code.trim())
      .maybeSingle();
    setBusy(false);
    if (error) return toast.error(error.message);
    setResult((data as Tripsheet) ?? null);
    if (!data) toast.error("No record found");
  };

  const reset = () => {
    setCode("");
    setResult(null);
    setSearched(false);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-muted/40">
        <h2 className="font-semibold mb-3">Search Data by Tripsheet / Vehicle Verification</h2>
        <RadioGroup
          value={by}
          onValueChange={(v) => setBy(v as SearchBy)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
        >
          {[
            { v: "tripsheet", l: "Tripsheet Code / Mineral Account Slip" },
            { v: "transit", l: "Transit Pass Number" },
            { v: "vehicle", l: "Vehicle Number" },
          ].map((o) => (
            <Label key={o.v} className="flex items-start gap-2 text-sm cursor-pointer">
              <RadioGroupItem value={o.v} className="mt-1" /> {o.l}
            </Label>
          ))}
        </RadioGroup>
        <Label htmlFor="code" className="text-sm font-semibold">{label} :</Label>
        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} className="bg-background mt-1" />
        <div className="flex gap-2 mt-3">
          <Button onClick={search} disabled={busy}>
            <Search className="w-4 h-4 mr-1" /> {busy ? "Searching..." : "Search"}
          </Button>
          <Button variant="secondary" onClick={reset}>Cancel</Button>
        </div>
      </Card>

      {searched && result && (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap justify-end gap-2 p-3 border-b bg-muted/30">
            <Link to="/record/$id" params={{ id: result.id }}>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" /> Open Public Link
              </Button>
            </Link>
            <Button size="sm" onClick={() => downloadTripsheetPdf(result)}>
              <Download className="w-4 h-4 mr-1" /> Download PDF
            </Button>
          </div>
          <div className="p-3">
            <TripsheetDetails record={result} />
          </div>
        </Card>
      )}
    </div>
  );
}
