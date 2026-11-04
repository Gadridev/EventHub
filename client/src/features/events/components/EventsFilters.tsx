import type { EventStatus } from "../../../types";
import { fieldClass } from "../../../components/ui/Fields";
import { StatusFilters } from "../../../components/ui/StatusFilters";

type EventsFiltersProps = {
  search: string;
  status: "all" | EventStatus;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: "all" | EventStatus) => void;
};

export function EventsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: EventsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        aria-label="Search events by title"
        placeholder="Search events by title"
        className={`${fieldClass} flex-[1_1_240px]`}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <StatusFilters
        options={["all", "draft", "published", "cancelled"] as const}
        value={status}
        onChange={onStatusChange}
      />
    </div>
  );
}
