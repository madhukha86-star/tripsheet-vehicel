import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { Tripsheet } from "@/components/SearchTripsheet";
import dgmLogoUrl from "@/assets/dgm-logo.png";

const v = (x: any) => (x == null ? "" : String(x));

function formatDateTime(s: any): string {
  if (!s) return "";
  const str = String(s);
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  // if input had no time component, show only date
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return `${dd}/${mm}/${yyyy}`;
  return `${dd}/${mm}/${yyyy}  ${String(h).padStart(2, "0")}.${min} ${ampm}`;
}

function formatDate(s: any): string {
  if (!s) return "";
  const d = new Date(String(s));
  if (isNaN(d.getTime())) return String(s);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function buildQrText(r: Tripsheet) {
  return [
    `Bulk Demand No: ${v(r.bulk_demand_number)}`,
    `Transit Pass No: ${v(r.transit_pass_number)}`,
    `Issue Date: ${formatDate(r.issue_date)}`,
    `Mineral Name: ${v(r.mineral_name_grade)}`,
    `Net Weight: ${v(r.net_weight_mt)}${r.net_weight_mt ? " MT" : ""}`,
    `Vehicle No: ${v(r.vehicle_number)}`,
    `Destination Address: ${v(r.destination_address)}`,
  ].join("\n");
}

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export async function downloadTripsheetPdf(r: Tripsheet) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 25;
  const left = margin;
  const right = pageW - margin;
  const W = right - left;

  const [qrDataUrl, logoDataUrl] = await Promise.all([
    QRCode.toDataURL(buildQrText(r), { margin: 1, width: 240 }),
    urlToDataUrl(dgmLogoUrl).catch(() => ""),
  ]);

  const LINE = 11;
  const PAD_X = 4;
  const PAD_Y = 8;
  doc.setFont("helvetica", "normal").setFontSize(9);

  const wrap = (text: string, w: number) => doc.splitTextToSize(v(text), w - PAD_X * 2);
  const hFor = (lines: string[], min = LINE + PAD_Y) =>
    Math.max(min, lines.length * LINE + PAD_Y);

  let y = margin + 5;

  // Dotted top line
  doc.setLineDashPattern([1, 2], 0);
  doc.setDrawColor(150);
  doc.line(left, y, right, y);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0);
  y += 12;

  // ============ HEADER (3 columns) ============
  const c1 = 175;      // logo + dept
  const c3 = 175;      // transit pass number + QR
  const c2 = W - c1 - c3;
  const headerH = 100;

  doc.setLineWidth(0.6);
  doc.rect(left, y, c1, headerH);
  doc.rect(left + c1, y, c2, headerH);
  doc.rect(left + c1 + c2, y, c3, headerH);

  // -- Col 1: logo + department text
  if (logoDataUrl) {
    try { doc.addImage(logoDataUrl, "PNG", left + 8, y + 10, 50, 50); } catch {}
  }
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Directorate of Geology & Mining", left + 8, y + 75);
  doc.text("Government of Maharashtra", left + 8, y + 88);

  // -- Col 2: split horizontally into top (title) and bottom (copy/region/district)
  const c2x = left + c1;
  const c2TopH = 50;
  doc.line(c2x, y + c2TopH, c2x + c2, y + c2TopH);

  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Transit Pass", c2x + c2 / 2, y + 16, { align: "center" });
  doc.setFontSize(10);
  doc.text("Issue Print – 2", c2x + c2 / 2, y + 30, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(formatDateTime(r.tripsheet_generate_datetime) || formatDate(r.issue_date), c2x + c2 / 2, y + 44, { align: "center" });

  doc.text(`Copy for : Driver`, c2x + 6, y + c2TopH + 14);
  doc.text(`Region: ${v(r.region)}`, c2x + 6, y + c2TopH + 28);
  doc.text(`District: ${v(r.district)}`, c2x + 6, y + c2TopH + 42);

  // -- Col 3: transit pass number top, details + QR bottom
  const c3x = left + c1 + c2;
  doc.line(c3x, y + c2TopH, c3x + c3, y + c2TopH);

  // Transit Pass Number — render on single line, auto-shrink font to fit
  doc.setFont("helvetica", "bold");
  const tpnLabel = "Transit Pass Number : ";
  const tpnValue = v(r.transit_pass_number);
  const innerW = c3 - 12;
  let tpnFont = 9;
  doc.setFontSize(tpnFont);
  while (doc.getTextWidth(tpnLabel + tpnValue) > innerW && tpnFont > 6) {
    tpnFont -= 0.5;
    doc.setFontSize(tpnFont);
  }
  doc.text(tpnLabel + tpnValue, c3x + 6, y + 16);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sr.No: ${v((r as any).sr_no) || "00001"}`, c3x + c3 / 2, y + 40, { align: "center" });

  // bottom of col3: text on left, QR on right
  const qrSize = 44;
  doc.setFontSize(8);
  doc.text(`Bulk Demand No : ${v(r.bulk_demand_number)}`, c3x + 6, y + c2TopH + 12);
  doc.text(`Vehicle Type: Lorry`, c3x + 6, y + c2TopH + 24);
  doc.text(`Vehicle No : ${v(r.vehicle_number)}`, c3x + 6, y + c2TopH + 36);
  doc.text(`Issued & Printed By: ${v(r.issued_by)}`, c3x + 6, y + c2TopH + 48);
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, "PNG", c3x + c3 - qrSize - 4, y + c2TopH + 4, qrSize, qrSize);
  }


  y += headerH;
  doc.setFontSize(9);

  // ============ BODY (4 columns) ============
  const b1 = 175; // label
  const b2 = 195; // value
  const b3 = 90;  // label2
  const b4 = W - b1 - b2 - b3; // value2

  const drawCell = (x: number, w: number, h: number, text: string, bold = false) => {
    doc.rect(x, y, w, h);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = wrap(text, w);
    doc.text(lines, x + PAD_X, y + LINE + 2);
  };

  const splitRow = (l1: string, v1: string, l2: string, v2: string) => {
    const h = Math.max(
      hFor(wrap(l1, b1)),
      hFor(wrap(v1, b2)),
      hFor(wrap(l2, b3)),
      hFor(wrap(v2, b4)),
    );
    drawCell(left, b1, h, l1);
    drawCell(left + b1, b2, h, v1);
    drawCell(left + b1 + b2, b3, h, l2);
    drawCell(left + b1 + b2 + b3, b4, h, v2);
    y += h;
  };

  const fullRow = (label: string, value: string, minH = LINE + PAD_Y) => {
    const valW = b2 + b3 + b4;
    const h = Math.max(minH, hFor(wrap(label, b1), minH), hFor(wrap(value, valW), minH));
    drawCell(left, b1, h, label);
    drawCell(left + b1, valW, h, value);
    y += h;
  };

  // Rows in the order shown in reference image
  fullRow("Lease Holder Code/Name", v(r.lease_holder_code_name));
  fullRow("Tahshil / Village /Sy No.", v(r.tahsil_village_syno));
  fullRow("Lease  Validity /IBM Mine Code", v(r.lease_validity_ibm_mine_code));
  fullRow("Transit Pass Purpose", v(r.transit_pass_purpose));

  splitRow("Issue Date", formatDate(r.issue_date), "Reissue Date", formatDate(r.issue_date));
  splitRow("Mineral Name / Grade", v(r.mineral_name_grade), "Grade", v((r as any).grade));
  splitRow(
    "Net Weight",
    v(r.net_weight_mt) ? `${v(r.net_weight_mt)} MT (Maximum permitted)` : "",
    "Vehicle No:",
    v(r.vehicle_number),
  );

  fullRow("Buyer Name", v(r.buyer_name));
  fullRow("Destination Address", v(r.destination_address), 55);

  splitRow("Route & Destination", v(r.route_destination) || v(r.route), "Distance :", v(r.distance));

  splitRow("Mode of Transportation", v(r.mode_of_transport), "Transporter Name", v(r.transporter_name));
  fullRow("Journey Start Date", formatDateTime(r.journey_start_date));
  splitRow("Weigh Bridge Name", v(r.weigh_bridge_name), "Driver Name / License No:", v(r.driver_name_licence_no));

  doc.save(`tripsheet-${v(r.tripsheet_code) || "record"}.pdf`);
}
