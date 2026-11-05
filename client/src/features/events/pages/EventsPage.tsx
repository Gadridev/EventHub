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
