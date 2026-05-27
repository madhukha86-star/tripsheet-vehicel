import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { Tripsheet } from "@/components/SearchTripsheet";

const v = (x: any) => (x ?? "").toString();

function buildQrText(r: Tripsheet) {
  return [
    `Bulk Demand No: ${v(r.bulk_demand_number)}`,
    `Transit Pass No: ${v(r.transit_pass_number)}`,
    `Issue Date: ${v(r.issue_date)}`,
    `Mineral Name: ${v(r.mineral_name_grade)}`,
    `Grade: ${v(r.mineral_name_grade)}`,
    `Net Weight: ${v(r.net_weight_mt)}${r.net_weight_mt ? " MT" : ""}`,
    `Vehicle No: ${v(r.vehicle_number)}`,
    `Destination Address: ${v(r.destination_address)}`,
  ].join("\n");
}

export async function downloadTripsheetPdf(r: Tripsheet) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  const qrText = buildQrText(r);
  const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 240 });

  // Layout constants
  const left = 30;
  const right = pageW - 30;
  const tableW = right - left;
  let y = 40;

  // Dotted top line
  doc.setLineDashPattern([1, 2], 0);
  doc.setDrawColor(120);
  doc.line(left, y, right, y);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0);
  y += 10;

  const tableTop = y;

  // ===== TOP HEADER BLOCK =====
  // 3 columns: logo/govt | center info | right info + QR
  const col1W = 230;
  const col3W = 270;
  const col2W = tableW - col1W - col3W;
  const headerH = 110;

  // Outer rects
  doc.setLineWidth(0.6);
  doc.rect(left, y, col1W, headerH);
  doc.rect(left + col1W, y, col2W, headerH);
  doc.rect(left + col1W + col2W, y, col3W, headerH);

  // --- Column 1: Logo + Govt text
  doc.setFont("helvetica", "bold").setFontSize(9);
  // Just text (no logo image available); place title at bottom of col1
  doc.text("Directorate of Geology & Mining,", left + 5, y + 75);
  doc.text("Government of Maharashtra", left + 5, y + 88);

  // --- Column 2: Transit Pass header (top), then sub fields
  const c2x = left + col1W;
  // Top portion ~ 50pt for header
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Transit Pass", c2x + col2W / 2, y + 16, { align: "center" });
  doc.setFontSize(10);
  doc.text("Issue Print – 2", c2x + col2W / 2, y + 30, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(v(r.tripsheet_generate_datetime) || v(r.issue_date), c2x + col2W / 2, y + 44, { align: "center" });

  // horizontal split inside col2
  doc.line(c2x, y + 52, c2x + col2W, y + 52);

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Copy for : Driver", c2x + 5, y + 65);
  doc.text(`Region: ${v((r as any).region) || ""}`, c2x + 5, y + 80);
  doc.text(`District: ${v((r as any).district) || ""}`, c2x + 5, y + 95);

  // --- Column 3: Transit pass number block + QR
  const c3x = left + col1W + col2W;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text(`Transit Pass Number : ${v(r.transit_pass_number)}`, c3x + 5, y + 16);
  doc.setFont("helvetica", "normal");
  doc.text(`Sr.No: 00001`, c3x + col3W / 2 - 20, y + 32);

  doc.line(c3x, y + 52, c3x + col3W, y + 52);

  doc.text(`Bulk Demand No :  ${v(r.bulk_demand_number)}`, c3x + 5, y + 65);
  doc.text(`Vehicle Type: ${v((r as any).vehicle_type) || "Lorry"}`, c3x + 5, y + 78);
  doc.text(`Vehicle N0 : ${v(r.vehicle_number)}`, c3x + 5, y + 91);
  doc.text(`Issued & Printed By:${v((r as any).issued_by) || ""}`, c3x + 5, y + 104);

  // QR in top-right corner of col3
  doc.addImage(qrDataUrl, "PNG", c3x + col3W - 55, y + 55, 50, 50);

  y += headerH;

  // ===== BODY ROWS =====
  const labelW = 230; // matches col1W for visual alignment
  const valueW = tableW - labelW;

  doc.setFont("helvetica", "normal").setFontSize(9);

  const fullRow = (label: string, value: string, h = 18) => {
    doc.rect(left, y, labelW, h);
    doc.rect(left + labelW, y, valueW, h);
    doc.text(label, left + 4, y + 12);
    const lines = doc.splitTextToSize(value, valueW - 8);
    doc.text(lines, left + labelW + 4, y + 12);
    y += h;
  };

  const splitRow = (l1: string, v1: string, l2: string, v2: string, h = 18) => {
    const half = tableW / 2;
    const lw = labelW;
    const vw1 = half - lw;
    const lw2 = 110;
    const vw2 = tableW - half - lw2;
    doc.rect(left, y, lw, h);
    doc.rect(left + lw, y, vw1, h);
    doc.rect(left + half, y, lw2, h);
    doc.rect(left + half + lw2, y, vw2, h);
    doc.text(l1, left + 4, y + 12);
    doc.text(doc.splitTextToSize(v1, vw1 - 8), left + lw + 4, y + 12);
    doc.text(l2, left + half + 4, y + 12);
    doc.text(doc.splitTextToSize(v2, vw2 - 8), left + half + lw2 + 4, y + 12);
    y += h;
  };

  fullRow("Lease Holder Code/Name", v(r.lease_holder_code_name));
  fullRow("Tahshil / Village /Sy No.", v(r.tahsil_village_syno));
  fullRow("Lease  Validity /IBM Mine Code", v(r.lease_validity_ibm_mine_code));
  fullRow("Transit Pass Purpose", v(r.transit_pass_purpose));

  splitRow("Issue Date", v(r.issue_date), "Reissue Date", v(r.issue_date));
  splitRow(
    "Mineral Name / Grade",
    v(r.mineral_name_grade),
    "Grade",
    v((r as any).grade) || ""
  );
  splitRow(
    "Net Weight",
    v(r.net_weight_mt) + (r.net_weight_mt ? " MT (Maximum permitted)" : ""),
    "Vehicle No:",
    v(r.vehicle_number)
  );

  fullRow("Buyer Name", v(r.buyer_name));

  // Destination address - taller
  const destLines = doc.splitTextToSize(v(r.destination_address), valueW - 8);
  const destH = Math.max(50, destLines.length * 12 + 16);
  doc.rect(left, y, labelW, destH);
  doc.rect(left + labelW, y, valueW, destH);
  doc.text("Destination Address", left + 4, y + 14);
  doc.text(destLines, left + labelW + 4, y + 14);
  y += destH;

  // Route & Destination + Distance (split)
  const routeLines = doc.splitTextToSize(v(r.route_destination) || v(r.route), tableW / 2 - labelW - 8);
  const routeH = Math.max(34, routeLines.length * 12 + 12);
  const half = tableW / 2;
  const lw2 = 110;
  const vw2 = tableW - half - lw2;
  doc.rect(left, y, labelW, routeH);
  doc.rect(left + labelW, y, half - labelW, routeH);
  doc.rect(left + half, y, lw2, routeH);
  doc.rect(left + half + lw2, y, vw2, routeH);
  doc.text("Route & Destination", left + 4, y + 12);
  doc.text(routeLines, left + labelW + 4, y + 12);
  doc.text("Distance :", left + half + 4, y + 12);
  doc.text(v(r.distance), left + half + lw2 + 4, y + 12);
  y += routeH;

  splitRow("Mode of Transportation", v(r.mode_of_transport), "Transporter Name", v(r.transporter_name));
  fullRow("Journey Start Date", v(r.journey_start_date));
  splitRow("Weigh Bridge Name", v(r.weigh_bridge_name), "Driver Name / License No:", v(r.driver_name_licence_no));

  doc.save(`tripsheet-${v(r.tripsheet_code) || "record"}.pdf`);
}
