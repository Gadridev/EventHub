export function Brand() {
  return (
    <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M0 0h10v10H0z" className="fill-accent" />
        <circle cx="16" cy="6" r="5" className="fill-coral" />
        <path d="M0 22V12h10z" className="fill-green" />
        <path d="M12 12h10v10H12z" className="fill-ink" />
      </svg>
      Event <span className="text-accent">Hub</span>
    </div>
  );
}
