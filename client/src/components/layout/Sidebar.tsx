import { Link, NavLink } from "react-router";
import { Brand } from "./Brand";
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-1.5 bg-sidebar px-4 py-6">
      <div className="px-3 pb-5">
        <Brand />
      </div>
      <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
        {[
          ["/", "Overview"],
          ["/events", "Events"],
          ["/registrations", "Registrations"],
          ["/participants", "Participants"],
        ].map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 transition-colors ${isActive ? "bg-accent text-page" : "hover:bg-surface"}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-3 py-3 text-[13px] text-muted">
        admin@eventhub.ma
        <br />
        Admin
        <br />
        <Link
          to="/login"
          onClick={onNavigate}
          className="mt-2 inline-block text-ink hover:text-accent"
        >
          Sign-in preview
        </Link>
      </div>
    </div>
  );
}
