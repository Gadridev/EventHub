import type { ReactNode } from "react";
export function PageHeader({
  title,
  section = title,
  action,
}: {
  title: string;
  section?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-muted">
          EventHub / {section}
        </p>
        <h1 className="text-[32px] leading-[1.25]">{title}</h1>
      </div>
      {action}
    </header>
  );
}
