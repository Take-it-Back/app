"use client";

export default function PrintButton({ label = "Print or save PDF" }: { label?: string }) {
  return (
    <button type="button" className="btn-plain" onClick={() => window.print()} style={{ background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>
      {label}
    </button>
  );
}
