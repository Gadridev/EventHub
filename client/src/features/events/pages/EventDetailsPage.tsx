import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  events,
  registrations,
  participants,
  users,
  eventSummaries,
  dateLabel,
} from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { CapacityBar } from "../../../components/ui/CapacityBar";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { EventForm } from "../components/EventForm";
export function EventDetailsPage() {
  const { eventId } = useParams();
  const event = events.find((item) => item.id === eventId);
  const [edit, setEdit] = useState(false);
  const [action, setAction] = useState("");
  if (!event)
    return (
      <>
        <PageHeader title="Event not found" section="Events" />
        <p className="text-muted">This event is not in the preview data.</p>
        <Link to="/events" className="text-accent">
          Back to events
        </Link>
      </>
    );
  const summary = eventSummaries[event.id];
  const creator = users.find((user) => user.id === event.createdBy);
  return (
    <>
      <PageHeader
        title={event.title}
        section="Events"
        action={
          <div className="flex gap-2">
            <Button onClick={() => setEdit(true)}>Edit event</Button>
            {event.status !== "cancelled" && (
              <Button
                primary
                onClick={() =>
                  setAction(
                    event.status === "draft" ? "Publish event" : "Cancel event",
                  )
                }
              >
                {event.status === "draft" ? "Publish" : "Cancel event"}
              </Button>
            )}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.36fr]">
        <section className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
          <div>
            <StatusBadge status={event.status} />
          </div>
          <p>
            {dateLabel(event.eventDate)} · {event.location}
          </p>
          <h2 className="text-xs uppercase tracking-wider text-muted">
            Capacity
          </h2>
          <p className="text-[44px] font-extrabold leading-tight">
            {summary.occupied}
            <span className="text-xl text-muted">
              {" "}
              / {event.maxParticipants}
            </span>
          </p>
          <CapacityBar
            large
            used={summary.occupied}
            capacity={event.maxParticipants}
          />
          <div aria-hidden="true" className="flex flex-wrap gap-[5px]">
            {Array.from(
              { length: Math.min(event.maxParticipants, 120) },
              (_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full ${i < summary.occupied ? "bg-accent" : "bg-border"}`}
                />
              ),
            )}
          </div>
          <p className="text-muted">{summary.available} spots available</p>
          <Link
            to="/events"
            className="rounded-lg border border-border px-3.5 py-2 text-center hover:bg-elevated"
          >
            Back to events
          </Link>
        </section>
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Registrations</h2>
          <div className="mt-2">
            {registrations
              .filter((row) => row.eventId === event.id)
              .map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 border-b border-border py-2.5"
                >
                  <span>
                    {
                      participants.find(
                        (person) => person.id === row.participantId,
                      )?.fullName
                    }
                  </span>
                  <StatusBadge status={row.status} />
                </div>
              ))}
            {!registrations.some((row) => row.eventId === event.id) && (
              <p className="py-6 text-muted">
                No registrations for this event.
              </p>
            )}
          </div>
        </section>
      </div>
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="text-xl">About this event</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {event.description}
        </p>
        {creator && (
          <p className="mt-4 text-xs text-muted">Created by {creator.email}</p>
        )}
      </section>
      {edit && (
        <EventForm initialValues={event} onClose={() => setEdit(false)} />
      )}
      {action && (
        <ConfirmDialog
          title={action}
          description={`Review this action for “${event.title}”. This is a presentation-only dialog.`}
          onClose={() => setAction("")}
        />
      )}
    </>
  );
}
