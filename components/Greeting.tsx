"use client";
import { useEffect, useState } from "react";

export default function Greeting({ name, style }: { name: string; style?: React.CSSProperties }) {
  const [part, setPart] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    setPart(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  return (
    <span style={{ fontWeight: 600, ...style, fontSize: 17 }}>
      {part}{name ? `, ${name}` : ""}.
    </span>
  );
}
