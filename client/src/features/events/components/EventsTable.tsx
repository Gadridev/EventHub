import { Link } from "react-router";
import { Pencil } from "lucide-react";
import type { Event } from "../../../types";
import { dateLabel } from "../../../data/mockData";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { CapacityBar } from "../../../components/ui/CapacityBar";
interface EventsTableProps {
  events: Event[];
  summaries: Record<string, { occupied: number }>;
  onEdit: (event: Event) => void;
  onAction: (action: string, event: Event) => void;
}
export function EventsTable({
  events,
  summaries,
  onEdit,
  onAction,
}: EventsTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[850px] border-collapse">
        <caption className="sr-only">Events and seat availability</caption>
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Status</th>
            <th>Seats</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <Link
                  className="hover:text-accent hover:underline"
                  to={`/events/${event.id}`}
                >
                  {event.title}
                </Link>
                <p className="text-[13px] leading-tight text-muted">
                  {event.location}
                </p>
              </td>
              <td className="whitespace-nowrap">
                {dateLabel(event.eventDate)}
              </td>
              <td>
                <StatusBadge status={event.status} />
              </td>
              <td className="min-w-[160px]">
                {summaries[event.id]?.occupied ?? 0}/{event.maxParticipants}
                <CapacityBar
                  used={summaries[event.id]?.occupied ?? 0}
                  capacity={event.maxParticipants}
                />
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button
                    aria-label={`Edit ${event.title}`}
                    onClick={() => onEdit(event)}
                    className="!px-2"
                  >
                    <Pencil size={14} />
                  </Button>
                  {event.status === "draft" && (
                    <>
                      <Button onClick={() => onAction("Publish event", event)}>
                        Publish
                      </Button>
                      <Button onClick={() => onAction("Delete event", event)}>
                        Delete
                      </Button>
                    </>
                  )}
                  {event.status === "published" && (
                    <Button
                      className="whitespace-nowrap"
                      onClick={() => onAction("Cancel event", event)}
                    >
                      Cancel event
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
