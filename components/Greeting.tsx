"use client";
import { useEffect, useState } from "react";

export default function Greeting({ name, style }: { name: string; style?: React.CSSProperties }) {
  const [part, setPart] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    setPart(h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening");
  }, []);
  return (
    <span className="serif" style={{ fontStyle: "italic", color: "#BF4F28", ...style }}>
      {part}{name ? `, ${name}` : ""} —
    </span>
  );
}
