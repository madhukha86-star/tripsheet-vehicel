import type { Tripsheet } from "@/components/SearchTripsheet";

const FIELDS: { key: keyof Tripsheet; label: string }[] = [
  { key: "transit_pass_number", label: "Transit Pass Number" },
  { key: "bulk_demand_number", label: "Bulk Demand Number" },
  { key: "vehicle_number", label: "Vehicle Number" },
  { key: "tripsheet_generate_datetime", label: "Tripsheet Generate Date & Time" },
  { key: "region", label: "Region" },
  { key: "district", label: "District" },
  { key: "issued_by", label: "Issued & Printed By" },
  { key: "lease_holder_code_name", label: "Lease Holder Code / Name" },
  { key: "tahsil_village_syno", label: "Tahsil / Village / Sy No." },
  { key: "lease_validity_ibm_mine_code", label: "Lease Validity / IBM Mine Code" },
  { key: "transit_pass_purpose", label: "Transit Pass Purpose" },
  { key: "issue_date", label: "Issue Date" },
  { key: "mineral_name_grade", label: "Mineral Name" },
  { key: "net_weight_mt", label: "Net Weight (MT)" },
  { key: "buyer_name", label: "Buyer Name" },
  { key: "destination_address", label: "Destination Address" },
  { key: "distance", label: "Distance" },
  { key: "route_destination", label: "Route & Destination" },
  { key: "mode_of_transport", label: "Mode of Transport" },
  { key: "transporter_name", label: "Transporter Name" },
  { key: "driver_name_licence_no", label: "Driver Name / Licence No." },
  { key: "journey_start_date", label: "Journey Start Date" },
  { key: "weigh_bridge_name", label: "Weigh Bridge Name" },
];

export function TripsheetDetails({ record }: { record: Tripsheet }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-xs sm:text-sm">
        <tbody>
          {FIELDS.map((f) => (
            <tr key={f.key as string} className="border-b last:border-0">
              <td className="px-2 sm:px-3 py-2 font-medium bg-muted/40 w-2/5 align-top">{f.label} :</td>
              <td className="px-2 sm:px-3 py-2 align-top break-words">{(record[f.key] as any) ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
