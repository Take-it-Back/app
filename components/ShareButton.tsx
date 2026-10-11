"use client";

import { useState } from "react";

/** Native share sheet on phones; copies the link elsewhere. */
export default function ShareButton({ url, text, label = "Share", variant = "btn-plain" }: { url: string; text: string; label?: string; variant?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={variant}
      onClick={async () => {
        try {
          if (navigator.share) await navigator.share({ text, url });
          else {
            await navigator.clipboard.writeText(`${text} ${url}`);
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          }
        } catch {
          /* closed the share sheet */
        }
      }}
    >
      {done ? "Link copied" : label}
    </button>
  );
}
