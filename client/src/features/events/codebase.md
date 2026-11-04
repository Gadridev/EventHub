# components/EventActionDialog.tsx

```tsx
import type { Event } from "../../../types";
import { ConfirmDialog } from "../../../components/ui/Modal";

import {
  usePublishEvent,
  useCancelEvent,
  useDeleteEvent,
} from "../hooks/useEventMutations";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";

export type EventAction = "publish" | "cancel" | "delete";

export function EventActionDialog({
  action,
  event,
  onSuccess,
  onClose,
}: {
  action: EventAction;
  event: Event;
  onSuccess: (action: EventAction) => void;
  onClose: () => void;
}) {
  const publishEvent = usePublishEvent();
  const cancelEvent = useCancelEvent();
  const deleteEvent = useDeleteEvent();

  let mutation: typeof publishEvent | typeof cancelEvent | typeof deleteEvent;
  switch (action) {
    case "publish":
      mutation = publishEvent;
      break;
    case "cancel":
      mutation = cancelEvent;
      break;
    case "delete":
      mutation = deleteEvent;
      break;
  }

  async function handleConfirm() {
    if (mutation.isPending) {
      return;
    }
    try {
      await mutation.mutateAsync(event.id);
    } catch {
      // The mutation error is displayed below; keep the dialog open for retry.
      return;
    }
    // Deleting can unmount this dialog when detail invalidation returns 404.
    // Awaiting the mutation still lets the page finish its navigation.
    onSuccess(action);
  }

  const titles = {
    publish: "Publish event",
    cancel: "Cancel event",
    delete: "Delete event",
  };
  const descriptions = {
    publish: `Publish “${event.title}” and open it for registrations?`,
    cancel: `Cancel “${event.title}”? All its registrations will also be cancelled. The event cannot be reopened.`,
    delete: `Permanently delete “${event.title}”? Events with registrations cannot be deleted.`,
  };
  return (
    <ConfirmDialog
      title={titles[action]}
      description={descriptions[action]}
      onConfirm={handleConfirm}
      onClose={onClose}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to update event.")
          : undefined
      }
    />
  );
}

```

# components/EventForm.tsx

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { toLocalDateTime, toIsoDateTime } from "../../../lib/dates";
import type { Event } from "../../../types";
import { Modal, PreviewNotice } from "../../../components/ui/Modal";
import { Input, Textarea } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
export type EventFormValues = Pick<
  Event,
  "title" | "description" | "location" | "eventDate" | "maxParticipants"
>;
interface EventFormProps {
  onClose: () => void;
  onSubmit?: (values: EventFormValues) => void;
  initialValues?: EventFormValues;
  loading?: boolean;
  error?: string;
}
export function EventForm({
  onClose,
  onSubmit,
  initialValues,
  loading = false,
  error,
}: EventFormProps) {
  const [values, setValues] = useState(
    initialValues
      ? {
          title: initialValues.title,
          description: initialValues.description,
          location: initialValues.location,
          maxParticipants: initialValues.maxParticipants,
          eventDate: toLocalDateTime(initialValues.eventDate),
        }
      : {
          title: "",
          description: "",
          location: "",
          eventDate: "",
          maxParticipants: 50,
        },
  );
  function handleClose() {
    if (!loading) onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !onSubmit) return;
    // Keep the original instant (including seconds) when the date is unchanged.
    const eventDate =
      initialValues &&
      values.eventDate === toLocalDateTime(initialValues.eventDate)
        ? initialValues.eventDate
        : toIsoDateTime(values.eventDate);
    onSubmit({ ...values, eventDate });
  }

  return (
    <Modal
      title={initialValues ? "Edit event" : "New event"}
      onClose={handleClose}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          label="Title"
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="Location"
          required
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
        <Textarea
          label="Description"
          required
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Event date (local time)"
            type="datetime-local"
            required
            value={values.eventDate}
            onChange={(e) =>
              setValues({
                ...values,
                eventDate: e.target.value,
              })
            }
          />
          <Input
            label="Capacity"
            type="number"
            min={1}
            required
            value={values.maxParticipants}
            onChange={(e) =>
              setValues({
                ...values,
                maxParticipants: e.target.valueAsNumber || 0,
              })
            }
          />
        </div>
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
        {!onSubmit && <PreviewNotice />}
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button primary type="submit" disabled={!onSubmit || loading}>
            {loading
              ? "Saving…"
              : initialValues
                ? "Save changes"
                : "Create draft"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

```

# components/EventFormDialog.tsx

```tsx
import type { Event } from "../../../types";
import type { EventInput } from "../events.api";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useCreateEvent, useUpdateEvent } from "../hooks/useEventMutations";
import { EventForm } from "./EventForm";

export function EventFormDialog({
  event,
  onClose,
}: {
  event?: Event;
  onClose: () => void;
}) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const mutation = event ? updateEvent : createEvent;

  function handleSubmit(input: EventInput) {
    if (mutation.isPending) {
      return;
    }
    if (!event) {
      createEvent.mutate(input, { onSuccess: onClose });
      return;
    }

    updateEvent.mutate(
      {
        id: event.id,
        input: {
          ...input,
          // Omit an unchanged date, including for events that are now in the past.
          eventDate:
            input.eventDate === event.eventDate ? undefined : input.eventDate,
        },
      },
      { onSuccess: onClose },
    );
  }

  return (
    <EventForm
      initialValues={event}
      onClose={onClose}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      error={
        mutation.error
          ? getApiErrorMessage(mutation.error, "Unable to save event.")
          : undefined
      }
    />
  );
}

```

# components/EventsFilters.tsx

```tsx
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

```

# components/EventsPagination.tsx

```tsx
import { Button } from "../../../components/ui/Button";

type EventsPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export function EventsPagination({
  page,
  totalPages,
  total,
  loading,
  onPageChange,
}: EventsPaginationProps) {
  return (
    <nav
      aria-label="Events pagination"
      className="flex items-center justify-between gap-3"
    >
      <Button
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {Math.max(1, totalPages)} · {total} events
      </span>
      <Button
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

```

# components/EventsTable.tsx

```tsx
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

```

# event-permissions.ts

```ts
import type { Event, User } from "../../types";

export function canManageEvent(
  user: User | null,
  event: Pick<Event, "createdBy">,
) {
  if (!user) {
    return false;
  }
  return user.role === "admin" || event.createdBy === user.id;
}

```

# events.api.ts

```ts
import { api } from "../../lib/api";
import type { Event, EventStatus, User } from "../../types";

export type EventInput = Pick<
  Event,
  "title" | "description" | "location" | "eventDate" | "maxParticipants"
>;
export type EventWithSeats = Event & {
  activeRegistrations: number;
  availableSeats: number;
};
export type EventDetails = EventWithSeats & { creator: User };
export type EventsQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: EventStatus;
};
export type EventsResponse = {
  data: EventWithSeats[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getEvents(params: EventsQuery, signal?: AbortSignal) {
  const response = await api.get<EventsResponse>("/events", { params, signal });
  return response.data;
}

export async function getEvent(id: string, signal?: AbortSignal) {
  const response = await api.get<{ data: EventDetails }>(`/events/${id}`, {
    signal,
  });
  return response.data.data;
}

export async function createEvent(input: EventInput) {
  const response = await api.post<{ data: Event }>("/events", input);
  return response.data.data;
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  const response = await api.patch<{ data: Event }>(`/events/${id}`, input);
  return response.data.data;
}

export async function changeEventStatus(
  id: string,
  status: "published" | "cancelled",
) {
  const response = await api.patch<{ data: Event }>(`/events/${id}/status`, {
    status,
  });
  return response.data.data;
}

export async function deleteEvent(id: string) {
  await api.delete(`/events/${id}`);
}

```

# hooks/useEvent.ts

```ts
import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../events.api";

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", "detail", id],
    queryFn: ({ signal }) => getEvent(id, signal),
  });
}

```

# hooks/useEventMutations.ts

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventsApi from "../events.api";
import type { EventInput } from "../events.api";

function useInvalidateEvents() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["events"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
}

export function useCreateEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: invalidateEvents,
  });
}

export function useUpdateEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EventInput> }) =>
      eventsApi.updateEvent(id, input),
    onSuccess: invalidateEvents,
  });
}

export function usePublishEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: string) => eventsApi.changeEventStatus(id, "published"),
    onSuccess: invalidateEvents,
  });
}

export function useCancelEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: string) => eventsApi.changeEventStatus(id, "cancelled"),
    onSuccess: invalidateEvents,
  });
}

export function useDeleteEvent() {
  const invalidateEvents = useInvalidateEvents();
  return useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: invalidateEvents,
  });
}

```

# hooks/useEvents.ts

```ts
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../events.api";
import type { EventsQuery } from "../events.api";

export function useEvents(query: EventsQuery) {
  return useQuery({
    queryKey: ["events", "list", query],
    queryFn: ({ signal }) => getEvents(query, signal),
  });
}

```

# pages/EventDetailsPage.tsx

```tsx
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
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Registrations</h2>
          <p className="py-6 text-muted">
            Registration details are not available here yet. The capacity
            summary uses current active registration counts.
          </p>
        </section>
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

```

# pages/EventsPage.tsx

```tsx
import { useEffect, useState } from "react";
import type { Event, EventStatus } from "../../../types";
import type { EventsQuery } from "../events.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { useEvents } from "../hooks/useEvents";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { ListState } from "../../../components/ui/ListState";
import { EventsTable } from "../components/EventsTable";
import { EventFormDialog } from "../components/EventFormDialog";
import { EventsFilters } from "../components/EventsFilters";
import { EventsPagination } from "../components/EventsPagination";
import { canManageEvent } from "../event-permissions";
import { EventActionDialog } from "../components/EventActionDialog";
import type { EventAction } from "../components/EventActionDialog";

export function EventsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<EventsQuery>({ page: 1, limit: 10 });
  const [form, setForm] = useState<Event | "new" | null>(null);
  const [action, setAction] = useState<{
    type: EventAction;
    event: Event;
  } | null>(null);
  const events = useEvents(query);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery((current) => ({ ...current, search: search.trim(), page: 1 }));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  function handleFilterChange(status: "all" | EventStatus) {
    setQuery((current) => ({
      ...current,
      status: status === "all" ? undefined : status,
      page: 1,
    }));
  }

  function canManage(event: Event) {
    return canManageEvent(user, event);
  }

  function handlePageChange(page: number) {
    setQuery((current) => ({ ...current, page }));
  }

  function openAction(type: EventAction, event: Event) {
    setAction({ type, event });
  }

  function handleActionSuccess(completedAction: EventAction) {
    setAction(null);
    if (
      completedAction === "delete" &&
      events.data?.data.length === 1 &&
      query.page > 1
    ) {
      handlePageChange(query.page - 1);
    }
  }

  function renderEvents() {
    if (events.isPending) {
      return <ListState state="loading" noun="events" />;
    }
    if (events.isError) {
      return (
        <ListState
          state="error"
          noun="events"
          errorMessage={getApiErrorMessage(
            events.error,
            "Unable to load events.",
          )}
          onRetry={() => void events.refetch()}
        />
      );
    }
    if (events.data.data.length === 0) {
      return <ListState state="empty" noun="events" />;
    }
    return (
      <EventsTable
        events={events.data.data}
        canManage={canManage}
        onEdit={setForm}
        onAction={openAction}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Events"
        action={
          <Button primary onClick={() => setForm("new")}>
            New event
          </Button>
        }
      />
      <EventsFilters
        search={search}
        status={query.status ?? "all"}
        onSearchChange={setSearch}
        onStatusChange={handleFilterChange}
      />
      {renderEvents()}
      {events.data && (
        <EventsPagination
          page={query.page}
          totalPages={events.data.pagination.totalPages}
          total={events.data.pagination.total}
          loading={events.isFetching}
          onPageChange={handlePageChange}
        />
      )}
      {form && (
        <EventFormDialog
          key={form === "new" ? "new" : form.id}
          event={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
        />
      )}
      {action && (
        <EventActionDialog
          key={`${action.event.id}-${action.type}`}
          action={action.type}
          event={action.event}
          onClose={() => setAction(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </>
  );
}

```

