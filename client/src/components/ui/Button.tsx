import type { ButtonHTMLAttributes } from "react";
export function Button({
  primary = false,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm leading-[1.25] transition-colors disabled:opacity-50 ${primary ? "border-accent bg-accent text-page hover:bg-accent/90" : "border-border bg-surface text-ink hover:bg-elevated"} ${className}`}
      {...props}
    />
  );
}
