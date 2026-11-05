import { Link } from "react-router";
import { Pencil } from "lucide-react";
import type { EventWithSeats } from "../events.api";
import type { EventAction } from "./EventActionDialog";
import { dateLabel } from "../../../lib/dates";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { CapacityBar } from "../../../components/ui/CapacityBar";
interface EventsTableProps {
  events: EventWithSeats[];
  canManage: (event: EventWithSeats) => boolean;
  onEdit: (event: EventWithSeats) => void;
  onAction: (action: EventAction, event: EventWithSeats) => void;
}
export function EventsTable({
  events,
  canManage,
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
                {event.activeRegistrations}/{event.maxParticipants}
                <CapacityBar
                  used={event.activeRegistrations}
                  capacity={event.maxParticipants}
                />
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  {canManage(event) && event.status !== "cancelled" && (
                    <Button
                      aria-label={`Edit ${event.title}`}
                      onClick={() => onEdit(event)}
                      className="!px-2"
                    >
                      <Pencil size={14} />
                    </Button>
                  )}
                  {canManage(event) && event.status === "draft" && (
                    <Button onClick={() => onAction("publish", event)}>
                      Publish
                    </Button>
                  )}
                  {canManage(event) && event.status !== "cancelled" && (
                    <Button
                      className="whitespace-nowrap"
                      onClick={() => onAction("cancel", event)}
                    >
                      Cancel event
                    </Button>
                  )}
                  {canManage(event) && (
                    <Button onClick={() => onAction("delete", event)}>
                      Delete
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
