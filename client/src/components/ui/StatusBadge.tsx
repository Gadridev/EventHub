import type { EventStatus, RegistrationStatus } from "../../types";
const colors = {
  published: "bg-success-bg text-success",
  confirmed: "bg-success-bg text-success",
  draft: "bg-warning-bg text-accent",
  pending: "bg-warning-bg text-accent",
  cancelled: "bg-danger-bg text-danger",
};
export function StatusBadge({
  status,
}: {
  status: EventStatus | RegistrationStatus;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${colors[status]}`}
    >
      {status}
    </span>
  );
}
