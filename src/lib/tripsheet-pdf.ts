import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import type { Tripsheet } from "@/components/SearchTripsheet";

export async function downloadTripsheetPdf(r: Tripsheet) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const v = (x: any) => (x ?? "").toString();

  // Build public URL for this record
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const recordUrl = `${origin}/record/${r.id}`;
  const qrDataUrl = await QRCode.toDataURL(recordUrl, { margin: 1, width: 240 });

  doc.setFontSize(12).setFont("helvetica", "bold");
  doc.text("Transit Pass", pageW / 2, 36, { align: "center" });
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text(`Transit Pass Number : ${v(r.transit_pass_number)}`, pageW - 40, 36, { align: "right" });
  doc.text(`Sr.No: 00001`, pageW - 40, 50, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text("Directorate of Geology & Mining,", 40, 36);
  doc.text("Government of Maharashtra", 40, 50);

  // QR code top-right area
  doc.addImage(qrDataUrl, "PNG", pageW - 110, 60, 70, 70);
  doc.setFontSize(7).setFont("helvetica", "normal");
  doc.text("Scan to view online", pageW - 75, 138, { align: "center" });

  const rows: [string, string][] = [
    ["Tripsheet Code", v(r.tripsheet_code)],
    ["Issue Date", v(r.issue_date)],
    ["Tripsheet Generate Date & Time", v(r.tripsheet_generate_datetime)],
    ["Lease Holder Code/Name", v(r.lease_holder_code_name)],
    ["Tahshil / Village / Sy No.", v(r.tahsil_village_syno)],
    ["Lease Validity / IBM Mine Code", v(r.lease_validity_ibm_mine_code)],
    ["Lease Name / Lease Code", v(r.lease_name_lease_code)],
    ["Transit Pass Purpose", v(r.transit_pass_purpose)],
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
  ];

  autoTable(doc, {
    startY: 150,
    head: [],
    body: rows,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5, textColor: 20, lineColor: 150 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 200, fillColor: [245, 245, 245] } },
    margin: { left: 40, right: 40 },
  });

  doc.save(`tripsheet-${v(r.tripsheet_code) || "record"}.pdf`);
}
