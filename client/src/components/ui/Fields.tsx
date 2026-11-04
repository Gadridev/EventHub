import { useId } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
export const fieldClass =
  "min-h-9 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm leading-[1.25] text-ink placeholder:text-muted/70";
export const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.06em] text-muted";
export function Input({
  label,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label className="block" htmlFor={inputId}>
      <span className={labelClass}>{label}</span>
      <input id={inputId} className={fieldClass} {...props} />
    </label>
  );
}
export function Select({
  label,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label className="block" htmlFor={inputId}>
      <span className={labelClass}>{label}</span>
      <select id={inputId} className={fieldClass} {...props}>
        {children}
      </select>
    </label>
  );
}
export function Textarea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea className={fieldClass} rows={3} {...props} />
    </label>
  );
}
