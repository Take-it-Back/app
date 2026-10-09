import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Plain, printable letter PDF for mail and fax. Standard fonts only support basic Latin text,
// so typographic characters are mapped to safe equivalents first.
const MAP: Record<string, string> = { "‘": "'", "’": "'", "“": '"', "”": '"', "–": "-", "—": "-", "…": "...", "•": "-", "·": "-", "→": "->", " ": " " };

function clean(s: string) {
  return s
    .replace(/[‘’“”–—…•·→ ]/g, (c) => MAP[c] || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

export async function letterPdf(body: string, opts: { title?: string } = {}) {
  const doc = await PDFDocument.create();
  doc.setTitle(opts.title || "Letter");
  doc.setProducer("Take it back");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = 11;
  const lineH = 15.5;
  const [W, H] = [612, 792]; // US Letter
  const margin = 72;
  const maxW = W - margin * 2;

  let page = doc.addPage([W, H]);
  let y = H - margin;
  const newPage = () => {
    page = doc.addPage([W, H]);
    y = H - margin;
  };

  for (const para of clean(body).split("\n")) {
    if (!para.trim()) {
      y -= lineH * 0.6;
      continue;
    }
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxW && line) {
        if (y < margin) newPage();
        page.drawText(line, { x: margin, y, size, font, color: rgb(0.1, 0.1, 0.1) });
        y -= lineH;
        line = w;
      } else line = test;
    }
    if (line) {
      if (y < margin) newPage();
      page.drawText(line, { x: margin, y, size, font, color: rgb(0.1, 0.1, 0.1) });
      y -= lineH;
    }
  }
  return doc.save();
}
