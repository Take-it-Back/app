"use client";

export default function ConfirmSubmit({ message, children, style, className }: { message: string; children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      style={style}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
