import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import axios from "axios";
import { dateLabel } from "../../../lib/dates";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useEvent } from "../hooks/useEvent";
import { ListState } from "../../../components/ui/ListState";
import { EventActionDialog } from "../components/EventActionDialog";
import type { EventAction } from "../components/EventActionDialog";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { CapacityBar } from "../../../components/ui/CapacityBar";
import { EventFormDialog } from "../components/EventFormDialog";
import { canManageEvent } from "../event-permissions";
import { EventRegistrations } from "../../registrations/components/EventRegistrations";
export function EventDetailsPage() {
  const { eventId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const eventQuery = useEvent(eventId);
  const event = eventQuery.data;
  const [edit, setEdit] = useState(false);
  const [action, setAction] = useState<EventAction | null>(null);
  function handleActionSuccess(completedAction: EventAction) {
    setAction(null);
    if (completedAction === "delete") {
      navigate("/events", { replace: true });
    }
  }

  if (eventQuery.isPending) {
    return <ListState state="loading" noun="event" />;
  }
  if (eventQuery.isError) {
    const notFound =
      axios.isAxiosError(eventQuery.error) &&
      eventQuery.error.response?.status === 404;
    return (
      <>
        <PageHeader
          title={notFound ? "Event not found" : "Event details"}
          section="Events"
        />
        <ListState
          state="error"
          noun="event"
          errorMessage={getApiErrorMessage(
            eventQuery.error,
            "Unable to load event.",
          )}
          onRetry={() => void eventQuery.refetch()}
        />
        <Link to="/events" className="text-accent">
          Back to events
        </Link>
      </>
    );
  }
  if (!event) {
    return null;
  }
  const canManage = canManageEvent(user, event);
  return (
    <>
      <PageHeader
        title={event.title}
        section="Events"
        action={
          canManage && (
            <div className="flex gap-2">
              {event.status !== "cancelled" && (
                <Button onClick={() => setEdit(true)}>Edit event</Button>
              )}
              {event.status === "draft" && (
                <Button primary onClick={() => setAction("publish")}>
                  Publish
                </Button>
              )}
              {event.status !== "cancelled" && (
                <Button onClick={() => setAction("cancel")}>
                  Cancel event
                </Button>
              )}
              <Button onClick={() => setAction("delete")}>Delete</Button>
            </div>
          )
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
            {event.activeRegistrations}
            <span className="text-xl text-muted">
              {" "}
              / {event.maxParticipants}
            </span>
          </p>
          <CapacityBar
            large
            used={event.activeRegistrations}
            capacity={event.maxParticipants}
          />
          <div aria-hidden="true" className="flex flex-wrap gap-[5px]">
            {Array.from(
              { length: Math.min(event.maxParticipants, 120) },
              (_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full ${i < event.activeRegistrations ? "bg-accent" : "bg-border"}`}
                />
              ),
            )}
          </div>
          <p className="text-muted">{event.availableSeats} spots available</p>
          <Link
            to="/events"
            className="rounded-lg border border-border px-3.5 py-2 text-center hover:bg-elevated"
          >
            Back to events
          </Link>
        </section>
        <EventRegistrations
          eventId={event.id}
          eventStatus={event.status}
        />
      </div>
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="text-xl">About this event</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {event.description}
        </p>
        {event.creator && (
          <p className="mt-4 text-xs text-muted">
            Created by {event.creator.email}
          </p>
        )}
      </section>
      {edit && (
        <EventFormDialog
          key={event.id}
          event={event}
          onClose={() => setEdit(false)}
        />
      )}
      {action && (
        <EventActionDialog
          key={`${event.id}-${action}`}
          action={action}
          event={event}
          onClose={() => setAction(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </>
  );
}
