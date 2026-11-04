import { useState } from "react";
import type { Event } from "../../../types";
import { events, eventSummaries } from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { fieldClass } from "../../../components/ui/Fields";
import { StatusFilters } from "../../../components/ui/StatusFilters";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { StatePreview, ListState } from "../../../components/ui/ListState";
import type { PreviewState } from "../../../components/ui/ListState";
import { EventsTable } from "../components/EventsTable";
import { EventForm } from "../components/EventForm";
export function EventsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Event["status"]>("all");
  const [form, setForm] = useState<Event | "new" | null>(null);
  const [action, setAction] = useState<{ title: string; event: Event } | null>(
    null,
  );
  const [state, setState] = useState<PreviewState>("ready");
  const visible = events.filter(
    (event) =>
      (filter === "all" || filter === event.status) &&
      `${event.title} ${event.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
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
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Search events or city"
          placeholder="Search events or city"
          className={`${fieldClass} flex-[1_1_240px]`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <StatusFilters
          options={["all", "draft", "published", "cancelled"] as const}
          value={filter}
          onChange={setFilter}
        />
      </div>
      {state === "ready" && visible.length ? (
        <EventsTable
          events={visible}
          summaries={eventSummaries}
          onEdit={setForm}
          onAction={(title, event) => setAction({ title, event })}
        />
      ) : (
        <ListState state={state === "ready" ? "empty" : state} noun="events" />
      )}
      <StatePreview value={state} onChange={setState} />
      {form && (
        <EventForm
          initialValues={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
        />
      )}
      {action && (
        <ConfirmDialog
          title={action.title}
          description={`Review this action for “${action.event.title}”. No event data will be changed in this preview.`}
          onClose={() => setAction(null)}
        />
      )}
    </>
  );
}
