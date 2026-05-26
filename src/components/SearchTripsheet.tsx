import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SearchBy = "tripsheet" | "transit" | "vehicle";

const FIELDS: { key: keyof Tripsheet; label: string }[] = [
  { key: "bulk_demand_number", label: "Bulk Demand Number" },
  { key: "transit_pass_number", label: "Transit Pass Number" },
  { key: "vehicle_number", label: "Vehicle Number" },
  { key: "tripsheet_generate_datetime", label: "Tripsheet Generate Date & Time" },
  { key: "lease_validity_ibm_mine_code", label: "Lease Validity / IBM Mine Code" },
  { key: "lease_name_lease_code", label: "Lease Name / Lease Code" },
  { key: "lease_holder_code_name", label: "Lease Holder Code / Name" },
  { key: "tahsil_village_syno", label: "Tahsil / Village / Sy No." },
  { key: "transit_pass_purpose", label: "Transit Pass Purpose" },
  { key: "issue_date", label: "Issue Date" },
  { key: "buyer_name_parcel_no", label: "Buyer Name & Parcel No." },
  { key: "buyer_name", label: "Buyer Name" },
  { key: "address", label: "Address" },
  { key: "destination_address", label: "Destination Address" },
  { key: "distance", label: "Distance" },
  { key: "route", label: "Route" },
  { key: "route_destination", label: "Route & Destination" },
  { key: "mineral_name_grade", label: "Mineral Name / Grade" },
  { key: "net_weight_mt", label: "Net Weight (MT)" },
  { key: "mode_of_transport", label: "Mode of Transport" },
  { key: "transporter_name", label: "Transporter Name" },
  { key: "driver_name_licence_no", label: "Driver Name / Licence No." },
  { key: "journey_start_date", label: "Journey Start Date" },
  { key: "weigh_bridge_name", label: "Weigh Bridge Name" },
];

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

function downloadPdf(r: Tripsheet) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const v = (x: any) => (x ?? "").toString();

  // Header band
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("Transit Pass", pageW / 2, 40, { align: "center" });
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text(`Transit Pass Number : ${v(r.transit_pass_number)}`, pageW - 40, 40, { align: "right" });
  doc.text(`Tripsheet Code : ${v(r.tripsheet_code)}    Sr.No: 00001`, pageW - 40, 54, { align: "right" });
  doc.text("Directorate of Geology & Mining, Government of Maharashtra", 40, 54);

  const rows: [string, string][] = [
    ["Lease Holder Code/Name", v(r.lease_holder_code_name)],
    ["Tahshil / Village /Sy No.", v(r.tahsil_village_syno)],
    ["Lease Validity /IBM Mine Code", v(r.lease_validity_ibm_mine_code)],
    ["Transit Pass Purpose", v(r.transit_pass_purpose)],
    ["Issue Date", v(r.issue_date)],
    ["Mineral Name / Grade", v(r.mineral_name_grade)],
    ["Net Weight", v(r.net_weight_mt) + (r.net_weight_mt ? " MT" : "")],
    ["Vehicle No", v(r.vehicle_number)],
    ["Bulk Demand No", v(r.bulk_demand_number)],
    ["Buyer Name", v(r.buyer_name)],
    ["Buyer Name & Parcel No.", v(r.buyer_name_parcel_no)],
    ["Address", v(r.address)],
    ["Destination Address", v(r.destination_address)],
    ["Route & Destination", v(r.route_destination)],
    ["Route", v(r.route)],
    ["Distance", v(r.distance)],
    ["Mode of Transportation", v(r.mode_of_transport)],
    ["Transporter Name", v(r.transporter_name)],
    ["Journey Start Date", v(r.journey_start_date)],
    ["Weigh Bridge Name", v(r.weigh_bridge_name)],
    ["Driver Name / License No", v(r.driver_name_licence_no)],
    ["Tripsheet Generate Date & Time", v(r.tripsheet_generate_datetime)],
  ];

  autoTable(doc, {
    startY: 75,
    head: [],
    body: rows,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5, textColor: 20, lineColor: 150 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 200, fillColor: [245, 245, 245] } },
    margin: { left: 40, right: 40 },
  });

  doc.save(`tripsheet-${v(r.tripsheet_code) || "record"}.pdf`);
}

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
            { v: "tripsheet", l: "Transit Pass Number / Mineral Account Slip" },
            { v: "transit", l: "Transit Pass Number for TSB" },
            { v: "vehicle", l: "Vehicle Number" },
          ].map((o) => (
            <Label key={o.v} className="flex items-start gap-2 text-sm cursor-pointer">
              <RadioGroupItem value={o.v} className="mt-1" /> {o.l}
            </Label>
          ))}
        </RadioGroup>
        <Label htmlFor="code" className="text-sm font-semibold">{label} :</Label>
        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="bg-background mt-1" />
        <div className="flex gap-2 mt-3">
          <Button onClick={search} disabled={busy}>
            <Search className="w-4 h-4 mr-1" /> Search
          </Button>
          <Button variant="secondary" onClick={reset}>Cancel</Button>
        </div>
      </Card>

      {searched && (
        <Card className="overflow-hidden">
          {result && (
            <div className="flex justify-end p-3 border-b bg-muted/30">
              <Button size="sm" onClick={() => downloadPdf(result)}>
                <Download className="w-4 h-4 mr-1" /> Download PDF
              </Button>
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              {FIELDS.map((f) => (
                <tr key={f.key as string} className="border-b last:border-0">
                  <td className="px-3 py-2 font-medium bg-muted/40 w-1/2 align-top">{f.label} :</td>
                  <td className="px-3 py-2 align-top">{(result?.[f.key] as any) ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
