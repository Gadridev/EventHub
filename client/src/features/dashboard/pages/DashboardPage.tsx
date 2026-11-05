import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { CapacityBar } from "../../../components/ui/CapacityBar";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ListState } from "../../../components/ui/ListState";
import { dateLabel } from "../../../lib/dates";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { EventFormDialog } from "../../events/components/EventFormDialog";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function DashboardPage() {
  const dashboard = useDashboardStats();
  const [selectedUpcomingId, setSelectedUpcomingId] = useState<string | null>(
    null,
  );
  const [createEvent, setCreateEvent] = useState(false);

  if (dashboard.isPending)
    return <ListState state="loading" noun="dashboard" />;
  if (dashboard.isError) {
    return (
      <ListState
        state="error"
        noun="dashboard"
        errorMessage={getApiErrorMessage(
          dashboard.error,
          "Unable to load dashboard.",
        )}
        onRetry={() => void dashboard.refetch()}
      />
    );
  }

  const stats = dashboard.data;
  const upcomingEvents = stats.upcomingEvents;
  const selectedUpcoming =
    upcomingEvents.find((event) => event.id === selectedUpcomingId) ??
    upcomingEvents[0];
  const metricCards = [
    {
      label: "Total events",
      value: stats.totalEvents,
      note: "all event statuses",
    },
    {
      label: "Published events",
      value: stats.publishedEvents,
      note: "open for registration",
    },
    {
      label: "Today's registrations",
      value: stats.registrationsToday,
      note: "created today (UTC)",
    },
    {
      label: "Total registrations",
      value: stats.totalRegistrations,
      note: "all statuses",
    },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        action={
          <Button primary onClick={() => setCreateEvent(true)}>
            New event
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((stat) => (
          <section
            key={stat.label}
            className="rounded-card border border-border bg-surface p-5"
          >
            <h2 className="text-xs uppercase tracking-wider text-muted">
              {stat.label}
            </h2>
            <p className="mt-1.5 text-[38px] font-extrabold">{stat.value}</p>
            <p className="text-[13px] text-muted">{stat.note}</p>
          </section>
        ))}
      </div>

      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="text-xl">Top 5 most-filled events</h2>
        {stats.mostFilledEvents.length === 0 ? (
          <p className="mt-4 text-muted">No published events to display.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {stats.mostFilledEvents.map((event) => (
              <div key={event.id}>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    className="font-bold text-accent hover:underline"
                    to={`/events/${event.id}`}
                  >
                    {event.title}
                  </Link>
                  <span className="text-sm text-muted">
                    {event.activeRegistrations}/{event.maxParticipants} ·{" "}
                    {event.fillPercentage}%
                  </span>
                </div>
                <CapacityBar
                  used={event.activeRegistrations}
                  capacity={event.maxParticipants}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Upcoming events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="mt-4 text-muted">No upcoming events.</p>
          ) : (
            <>
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {upcomingEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedUpcomingId(event.id)}
                    aria-label={event.title}
                    aria-pressed={selectedUpcoming?.id === event.id}
                    className={`flex min-w-[60px] flex-col items-center rounded-xl py-2.5 transition-colors ${selectedUpcoming?.id === event.id ? "bg-accent text-page" : "bg-elevated text-muted hover:bg-border"}`}
                  >
                    <span className="text-xs">
                      {dateLabel(event.eventDate).split(" ")[1]}
                    </span>
                    <span className="text-xl font-extrabold">
                      {dateLabel(event.eventDate).split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
              {selectedUpcoming && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-elevated p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">
                      Next up
                    </p>
                    <h3 className="mt-1 text-2xl">{selectedUpcoming.title}</h3>
                    <p className="mt-1 text-muted">
                      {dateLabel(selectedUpcoming.eventDate)} ·{" "}
                      {selectedUpcoming.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold">
                      {selectedUpcoming.availableSeats}
                    </p>
                    <p className="text-sm text-muted">seats left</p>
                    <Link
                      to={`/events/${selectedUpcoming.id}`}
                      className="mt-2 inline-block text-accent hover:underline"
                    >
                      Open event
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Registration status</h2>
          <div className="mt-4 flex flex-col gap-3">
            {(["confirmed", "pending", "cancelled"] as const).map((status) => {
              const counts = {
                confirmed: stats.confirmedRegistrations,
                pending: stats.pendingRegistrations,
                cancelled: stats.cancelledRegistrations,
              };
              return (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <b>{counts[status]}</b>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      {createEvent && <EventFormDialog onClose={() => setCreateEvent(false)} />}
    </>
  );
}
