import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Brand } from "./Brand";
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
        {user?.email}
        <br />
        <span className="capitalize">{user?.role}</span>
        <br />
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
            navigate("/login", { replace: true });
          }}
          className="mt-2 inline-block text-ink hover:text-accent"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
