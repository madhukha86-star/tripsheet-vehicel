import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Field = { key: string; label: string; type?: string; textarea?: boolean };

const FIELDS: Field[] = [
  { key: "tripsheet_code", label: "Tripsheet Code (unique)" },
  { key: "transit_pass_number", label: "Transit Pass Number" },
  { key: "bulk_demand_number", label: "Bulk Demand No" },
  { key: "vehicle_number", label: "Vehicle Number" },
  { key: "tripsheet_generate_datetime", label: "Tripsheet Generate Date & Time", type: "datetime-local" },
  { key: "lease_holder_code_name", label: "Lease Holder Code / Name" },
  { key: "lease_name_lease_code", label: "Lease Name / Lease Code" },
  { key: "tahsil_village_syno", label: "Tahsil / Village / Sy No." },
  { key: "lease_validity_ibm_mine_code", label: "Lease Validity / IBM Mine Code" },
  { key: "transit_pass_purpose", label: "Transit Pass Purpose" },
  { key: "issue_date", label: "Issue Date", type: "date" },
  { key: "mineral_name_grade", label: "Mineral Name / Grade" },
  { key: "net_weight_mt", label: "Net Weight (MT)", type: "number" },
  { key: "buyer_name", label: "Buyer Name" },
  { key: "buyer_name_parcel_no", label: "Buyer Name & Parcel No." },
  { key: "address", label: "Address", textarea: true },
  { key: "destination_address", label: "Destination Address", textarea: true },
  { key: "distance", label: "Distance" },
  { key: "route", label: "Route" },
  { key: "route_destination", label: "Route & Destination", textarea: true },
  { key: "mode_of_transport", label: "Mode of Transportation" },
  { key: "transporter_name", label: "Transporter Name" },
  { key: "driver_name_licence_no", label: "Driver Name / Licence No." },
  { key: "journey_start_date", label: "Journey Start Date", type: "datetime-local" },
  { key: "weigh_bridge_name", label: "Weigh Bridge Name" },
];

export function AddTripsheet() {
  const { user } = useAuth();
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login");
    if (!form.tripsheet_code?.trim()) return toast.error("Tripsheet Code is required");

    setBusy(true);
    const payload: Record<string, any> = { created_by: user.id };
    for (const f of FIELDS) {
      const v = form[f.key]?.trim();
      if (!v) continue;
      payload[f.key] = f.type === "number" ? Number(v) : v;
    }
    const { error } = await supabase.from("tripsheets").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Tripsheet added");
    setForm({});
  };

  return (
    <Card className="p-5">
      <h2 className="font-semibold mb-4">Add Tripsheet Data</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.textarea ? "md:col-span-2" : ""}>
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
        <div className="md:col-span-2 flex gap-2">
          <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save Tripsheet"}</Button>
          <Button type="button" variant="secondary" onClick={() => setForm({})}>Reset</Button>
        </div>
      </form>
    </Card>
  );
}
