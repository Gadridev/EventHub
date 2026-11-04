import { useState } from "react";
import { Link } from "react-router";
import type { RegistrationStatus } from "../../../types";
import {
  registrations,
  participants,
  events,
  dateLabel,
} from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { fieldClass } from "../../../components/ui/Fields";
import { StatusFilters } from "../../../components/ui/StatusFilters";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { StatePreview, ListState } from "../../../components/ui/ListState";
import type { PreviewState } from "../../../components/ui/ListState";
import { EventForm } from "../../events/components/EventForm";
import { RegistrationForm } from "../components/RegistrationForm";
export function RegistrationsPage() {
  const [status, setStatus] = useState<"all" | RegistrationStatus>("all");
  const [eventId, setEventId] = useState("all");
  const [create, setCreate] = useState(false);
  const [action, setAction] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [state, setState] = useState<PreviewState>("ready");
  const visible = registrations.filter(
    (row) =>
      (status === "all" || row.status === status) &&
      (eventId === "all" || row.eventId === eventId),
  );
  return (
    <>
      <PageHeader
        title="Registrations"
        action={
          <Button primary onClick={() => setCreate(true)}>
            New event
          </Button>
        }
      />
      <RegistrationForm events={events} participants={participants} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilters
          options={["all", "pending", "confirmed", "cancelled"] as const}
          value={status}
          onChange={setStatus}
        />
        <select
          aria-label="Filter registrations by event"
          className={`${fieldClass} !w-auto max-w-full`}
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="all">All events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>
      {state === "ready" && visible.length ? (
        <div className="relative overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[850px] border-collapse">
            <caption className="sr-only">Event registrations</caption>
            <thead>
              <tr>
                <th>Participant</th>
                <th>Event</th>
                <th>Status</th>
                <th>Created</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const person = participants.find(
                  (item) => item.id === row.participantId,
                );
                const event = events.find((item) => item.id === row.eventId);
                return (
                  <tr key={row.id}>
                    <td>
                      {person?.fullName}
                      <p className="text-[13px] leading-tight text-muted">
                        {person?.email}
                      </p>
                    </td>
                    <td>
                      <Link
                        className="hover:text-accent"
                        to={`/events/${row.eventId}`}
                      >
                        {event?.title}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="whitespace-nowrap text-muted">
                      {dateLabel(row.createdAt)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {row.status === "pending" && (
                          <Button
                            onClick={() =>
                              setAction({
                                title: "Confirm registration",
                                description: `${person?.fullName} — ${event?.title}`,
                              })
                            }
                          >
                            Confirm
                          </Button>
                        )}
                        {row.status !== "cancelled" && (
                          <Button
                            onClick={() =>
                              setAction({
                                title: "Cancel registration",
                                description: `${person?.fullName} — ${event?.title}`,
                              })
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <ListState
          state={state === "ready" ? "empty" : state}
          noun="registrations"
        />
      )}
      <StatePreview value={state} onChange={setState} />
      {create && <EventForm onClose={() => setCreate(false)} />}
      {action && <ConfirmDialog {...action} onClose={() => setAction(null)} />}
    </>
  );
}
