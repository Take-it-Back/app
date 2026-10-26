"use client";

import { useFormStatus } from "react-dom";

/** A form button that turns off while the form is saving, so a double tap can't save twice. */
export default function SubmitButton({ children, pendingText = "Saving…", className = "btn-plain", style }: { children: React.ReactNode; pendingText?: string; className?: string; style?: React.CSSProperties }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} style={style} disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
