import { useState } from "react";
import { Link } from "react-router";
import {
  events,
  eventSummaries,
  dashboardStats,
  registrationSummary,
  dateLabel,
} from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { CapacityBar } from "../../../components/ui/CapacityBar";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { EventForm } from "../../events/components/EventForm";
export function DashboardPage() {
  const upcoming = events.filter((event) => event.status === "published");
  const [selected, setSelected] = useState(upcoming[0]);
  const [create, setCreate] = useState(false);
  return (
    <>
      <PageHeader
        title="Overview"
        action={
          <Button primary onClick={() => setCreate(true)}>
            New event
          </Button>
        }
      />
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
        Upcoming dates
      </p>
      <div className="flex gap-2">
        {upcoming.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelected(event)}
            aria-label={event.title}
            aria-pressed={selected.id === event.id}
            className={`flex min-w-[60px] flex-col items-center rounded-xl py-2.5 transition-colors ${selected.id === event.id ? "bg-accent text-page" : "bg-surface text-muted hover:bg-elevated"}`}
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
      <section
        aria-label="Next up"
        className="flex flex-wrap overflow-hidden rounded-2xl border border-border bg-surface"
      >
        <div className="relative min-w-0 flex-[1_1_320px] p-7 sm:pr-[150px]">
          <svg
            className="absolute right-0 top-0 hidden sm:block"
            width="130"
            height="130"
            viewBox="0 0 130 130"
            aria-hidden="true"
          >
            <circle cx="110" cy="20" r="46" className="fill-coral" />
            <circle cx="110" cy="20" r="26" className="fill-accent" />
            <polygon points="10,125 50,75 90,125" className="fill-green" />
          </svg>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            Next up
          </p>
          <h2 className="mt-1.5 text-[34px] leading-tight">{selected.title}</h2>
          <p className="mt-1.5 text-muted">
            {dateLabel(selected.eventDate)} · {selected.location}
          </p>
          <Link
            to={`/events/${selected.id}`}
            className="mt-4 inline-block rounded-lg border border-border px-3.5 py-2 hover:bg-elevated"
          >
            Open event
          </Link>
        </div>
        <div className="flex min-w-[180px] flex-[0_0_180px] flex-col items-center justify-center border-l-2 border-dashed border-page bg-coral p-5 font-extrabold text-page max-sm:flex-1">
          <span className="text-[56px] leading-none">
            {eventSummaries[selected.id].available}
          </span>
          <span>seats left</span>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
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
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Seat utilization by event</h2>
          <div className="mt-4 flex flex-col gap-4">
            {upcoming.map((event) => (
              <div key={event.id}>
                <div className="mb-1.5 flex justify-between gap-2">
                  <span>{event.title}</span>
                  <span className="text-muted">
                    {eventSummaries[event.id].occupied}/{event.maxParticipants}
                  </span>
                </div>
                <CapacityBar
                  used={eventSummaries[event.id].occupied}
                  capacity={event.maxParticipants}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Registration status</h2>
          <div className="mt-4 flex flex-col gap-3">
            {registrationSummary.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <StatusBadge status={item.status} />
                <b>{item.count}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="text-xl">Upcoming events</h2>
        <div className="mt-2">
          {upcoming.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
            >
              <div>
                <Link
                  className="font-bold text-accent hover:underline"
                  to={`/events/${event.id}`}
                >
                  {event.title}
                </Link>
                <p className="text-[13px] text-muted">
                  {dateLabel(event.eventDate)} · {event.location}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">
                {eventSummaries[event.id].available} left
              </span>
            </div>
          ))}
        </div>
      </section>
      {create && <EventForm onClose={() => setCreate(false)} />}
    </>
  );
}
