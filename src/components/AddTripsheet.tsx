import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Field = { key: string; label: string; type?: string; textarea?: boolean; defaultValue?: string };

const FIELDS: Field[] = [
  { key: "transit_pass_number", label: "Transit Pass Number" },
  { key: "sr_no", label: "Sr. No", defaultValue: "00001" },
  { key: "bulk_demand_number", label: "Bulk Demand No" },
  { key: "vehicle_number", label: "Vehicle Number" },
  { key: "tripsheet_generate_datetime", label: "Tripsheet Generate Date & Time", type: "datetime-local" },
  { key: "region", label: "Region", defaultValue: "Kolhapur" },
  { key: "district", label: "District", defaultValue: "Sindhudurg" },
  { key: "issued_by", label: "Issued & Printed By" },
  { key: "lease_holder_code_name", label: "Lease Holder Code / Name" },
  { key: "tahsil_village_syno", label: "Tahsil / Village / Sy No." },
  { key: "lease_validity_ibm_mine_code", label: "Lease Validity / IBM Mine Code" },
  { key: "transit_pass_purpose", label: "Transit Pass Purpose" },
  { key: "issue_date", label: "Issue Date", type: "date" },
  { key: "mineral_name_grade", label: "Mineral Name" },
  { key: "grade", label: "Grade" },
  { key: "net_weight_mt", label: "Net Weight (MT)", type: "number" },
  { key: "buyer_name", label: "Buyer Name" },
  { key: "destination_address", label: "Destination Address", textarea: true },
  { key: "distance", label: "Distance" },
  { key: "route_destination", label: "Route & Destination", textarea: true },
  { key: "mode_of_transport", label: "Mode of Transportation" },
  { key: "transporter_name", label: "Transporter Name" },
  { key: "driver_name_licence_no", label: "Driver Name / Licence No." },
  { key: "journey_start_date", label: "Journey Start Date", type: "datetime-local" },
  { key: "weigh_bridge_name", label: "Weigh Bridge Name" },
];

const initialForm = () => {
  const f: Record<string, string> = {};
  for (const x of FIELDS) if (x.defaultValue) f[x.key] = x.defaultValue;
  return f;
};

export function AddTripsheet() {
  const { user } = useAuth();
  const [form, setForm] = useState<Record<string, string>>(initialForm());
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login");
    if (!form.transit_pass_number?.trim()) return toast.error("Transit Pass Number is required");

    setBusy(true);
    const payload: Record<string, any> = {
      created_by: user.id,
      tripsheet_code: form.transit_pass_number.trim(),
    };
    for (const f of FIELDS) {
      const v = form[f.key]?.trim();
      if (!v) continue;
      if (f.type === "number") payload[f.key] = Number(v);
      else if (f.type === "datetime-local") {
        // Treat input as local time and store as ISO with timezone
        const d = new Date(v);
        payload[f.key] = isNaN(d.getTime()) ? v : d.toISOString();
      } else payload[f.key] = v;
    }
    const { error } = await supabase.from("tripsheets").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Record added");
    setForm(initialForm());
  };

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="font-semibold mb-4">Add Tripsheet Data</h2>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
            <Label htmlFor={f.key} className="text-sm">{f.label}</Label>
            {f.textarea ? (
              <Textarea
                id={f.key}
                value={form[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
                className="mt-1"
              />
            ) : (
              <Input
                id={f.key}
                type={f.type ?? "text"}
                value={form[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
                className="mt-1"
              />
            )}
          </div>
        ))}
        <div className="sm:col-span-2 flex gap-2">
          <Button type="submit" disabled={busy} className="flex-1 sm:flex-none">{busy ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="secondary" onClick={() => setForm(initialForm())}>Reset</Button>
        </div>
      </form>
    </Card>
  );
}
