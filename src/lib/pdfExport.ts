/**
 * Lightweight zero-dependency PDF 1.4 generator for calctax.in calculation summaries.
 * Converts ₹ to "Rs." for universal compatibility with standard PDF WinAnsi fonts.
 */

export interface PdfSummaryPayload {
  filename: string;
  heading: string;
  subtitle: string;
  rows: Array<{ label: string; value: string; bold?: boolean }>;
  note?: string;
}

function sanitizePdfText(text: string): string {
  return text
    .replace(/₹/g, 'Rs. ')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapLine(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function downloadCalculationPdf(payload: PdfSummaryPayload): void {
  const commands: string[] = [];

  // Header Banner
  commands.push('0.059 0.463 0.431 rg'); // #0F766E teal fill
  commands.push('40 740 515 56 re f');

  commands.push('1 1 1 rg');
  commands.push('BT /F2 18 Tf 56 770 Td (Tax Calculator - calctax.in) Tj ET');
  commands.push('BT /F1 10 Tf 56 752 Td (Last verified for FY 2026-27 / AY 2027-28) Tj ET');

  // Document Title
  commands.push('0.059 0.090 0.165 rg'); // #0F172A slate-900
  commands.push(`BT /F2 15 Tf 44 708 Td (${sanitizePdfText(payload.heading)}) Tj ET`);
  commands.push('0.392 0.455 0.545 rg'); // slate-500
  commands.push(`BT /F1 10 Tf 44 691 Td (${sanitizePdfText(payload.subtitle)}) Tj ET`);

  // Horizontal divider
  commands.push('0.886 0.910 0.941 RG'); // slate-200 stroke
  commands.push('1 w 44 678 m 551 678 l S');

  // Rows
  let y = 654;
  for (let i = 0; i < payload.rows.length; i++) {
    const row = payload.rows[i];
    if (y < 140) break;

    if (row.bold) {
      commands.push('0.941 0.992 0.976 rg'); // light emerald tint
      commands.push(`44 ${y - 6} 507 22 re f`);
    }

    const font = row.bold ? '/F2' : '/F1';
    const size = row.bold ? 11 : 10;
    commands.push('0.200 0.255 0.333 rg');
    commands.push(`BT ${font} ${size} Tf 52 ${y} Td (${sanitizePdfText(row.label)}) Tj ET`);

    commands.push('0.059 0.090 0.165 rg');
    commands.push(`BT /F2 ${size} Tf 360 ${y} Td (${sanitizePdfText(row.value)}) Tj ET`);

    commands.push('0.910 0.929 0.953 RG');
    commands.push(`0.5 w 44 ${y - 8} m 551 ${y - 8} l S`);
    y -= 26;
  }

  // Optional Note
  if (payload.note && y > 130) {
    y -= 10;
    commands.push('0.278 0.333 0.412 rg');
    const noteLines = wrapLine(sanitizePdfText(payload.note), 86);
    for (const line of noteLines) {
      if (y < 105) break;
      commands.push(`BT /F1 9.5 Tf 44 ${y} Td (${line}) Tj ET`);
      y -= 14;
    }
  }

  // Footer Disclaimer
  commands.push('0.886 0.910 0.941 RG');
  commands.push('1 w 44 82 m 551 82 l S');
  commands.push('0.392 0.455 0.545 rg');
  commands.push(
    'BT /F1 8.5 Tf 44 66 Td (Disclaimer: This tool provides estimates for informational purposes only. Please consult a) Tj ET'
  );
  commands.push(
    'BT /F1 8.5 Tf 44 54 Td (qualified Chartered Accountant (CA) or check official Income Tax portals before final filing.) Tj ET'
  );
  commands.push(
    'BT /F1 8.5 Tf 44 40 Td (Published by Sumit Roy | Bamangachi, North 24 Parganas, WB | calctax.in) Tj ET'
  );

  const streamContent = commands.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    const padded = String(offsets[i]).padStart(10, '0');
    pdf += `${padded} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = payload.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
