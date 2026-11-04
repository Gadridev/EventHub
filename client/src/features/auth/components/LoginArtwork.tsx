import { CalendarDays } from "lucide-react";

export function LoginArtwork() {
  return (
    <section className="relative flex min-h-[340px] flex-col justify-between gap-12 overflow-hidden bg-sidebar p-8 md:min-h-dvh md:p-14">
      <div className="z-10 flex items-center gap-2.5 font-semibold">
        <CalendarDays size={24} />
        Event <span className="text-accent">Hub</span>
      </div>
      <svg
        className="absolute right-0 top-0"
        width="150"
        height="150"
        viewBox="0 0 150 150"
        aria-hidden="true"
      >
        <path d="M0 0A150 150 0 0 0 150 150L150 0Z" className="fill-accent" />
        <circle cx="120" cy="30" r="40" className="fill-coral" />
        <circle cx="120" cy="30" r="18" className="fill-page" />
      </svg>
      <div className="relative z-10 md:-mt-4">
        <h1 className="max-w-[420px] text-[38px] leading-[1.1] md:text-[44px]">
          Every <span className="text-accent">seat</span>
          <br />
          accounted for.
        </h1>
        <p className="mt-4 max-w-[380px] leading-relaxed text-muted">
          Run events, participants and registrations from one calm workspace.
        </p>
      </div>
      <div className="hidden h-16 items-end gap-1.5 md:flex" aria-hidden="true">
        {[24, 40, 32, 56, 48, 64].map((height, i) => (
          <div
            key={height}
            style={{ height }}
            className={`w-3.5 ${i === 3 || i === 5 ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>
      <svg
        className="pointer-events-none absolute bottom-0 right-0 hidden md:block"
        width="420"
        height="420"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <circle
          cx="300"
          cy="300"
          r="170"
          fill="none"
          className="stroke-border"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <circle cx="300" cy="300" r="120" className="fill-coral" />
        <circle cx="300" cy="300" r="78" className="fill-ink" />
        <circle cx="300" cy="300" r="40" className="fill-accent" />
        {[0, 32, 64, 96].map((x) => (
          <rect
            key={x}
            x={x}
            y="230"
            width="16"
            height="190"
            className="fill-green"
          />
        ))}
        <polygon points="130,420 230,420 130,320" className="fill-accent" />
      </svg>
    </section>
  );
}
