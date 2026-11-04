# .gitignore

```
node_modules/
dist/
.DS_Store
artifacts/
test-results/
playwright-report/

```

# index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#11222D" />
    <title>EventHub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

# package.json

```json
{
  "name": "eventhub-ui-lab",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview",
    "test:ui": "playwright test",
    "format": "prettier --write src tests *.ts *.json index.html README.md",
    "format:check": "prettier --check src tests *.ts *.json index.html README.md"
  },
  "dependencies": {
    "lucide-react": "^0.577.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router": "^7.13.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.64.1",
    "@tailwindcss/vite": "^4.2.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.1.0",
    "prettier": "^3.9.10",
    "tailwindcss": "^4.2.0",
    "typescript": "~5.9.3",
    "vite": "^7.3.0"
  },
  "engines": {
    "node": ">=22.12.0"
  },
  "volta": {
    "node": "24.14.0",
    "npm": "11.9.0"
  }
}

```

# playwright.config.ts

```ts
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:5173",
    viewport: { width: 1360, height: 900 },
    channel: "chrome",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});

```

# public/fonts/mulish-latin.woff2

This is a binary file of the type: Binary

# public/fonts/OFL.txt

```txt

Some of the files packed into this page (the "__bundler/manifest" data in this file, unpacked by the page’s script when it opens) are font files downloaded unchanged from Google Fonts (fonts.gstatic.com) when the page was saved. Google Fonts serves each family in pieces, one file per range of characters, so these may not be complete families. Each family’s license follows and still applies to its files. If you pass this file on, keep this comment in it.

Mulish

Copyright 2016 The Mulish Project Authors (https://github.com/googlefonts/mulish)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.


```

# README.md

```md
# EventHub UI Lab

Standalone, UI-only React + TypeScript application. All domain data lives in `src/data/mockData.ts`; no authentication, requests, storage, or mutations are implemented.

## Run

Use Node 22.12+ (Node 24 recommended).

\`\`\`sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
\`\`\`

Routes: `/`, `/events`, `/events/e1`, `/participants`, `/registrations`, `/login`.

## Structure

- `src/app`: router and application entry
- `src/components/layout`: desktop/mobile navigation and shared shell
- `src/components/ui`: buttons, fields, native modal dialog, status badges, capacity bar, filters, display-state previews
- `src/features`: dashboard, auth, events, participants, registrations
- `src/data`: consistent sample entities and separate presentation summaries
- `src/types`: supplied domain interfaces
- `src/index.css`: Tailwind v4 tokens and global foundations
- `public/fonts`: locally hosted Mulish from the supplied prototype, with its license

Form components expose typed optional submit callbacks. Final mutation confirmation is disabled until a callback is supplied. Login never creates a session or redirects on submit. The separate interface-preview link is ordinary navigation. Use the collapsed “Preview display states” controls to inspect loading/error/empty presentations; these do not simulate network activity.

Native dialogs provide focus containment, Escape dismissal, background inertness, and focus restoration. Tables scroll horizontally on narrow screens. Main navigation becomes a modal on mobile.

## Reference decisions

Original references remain untouched in `../design-references`. All six PNGs were inspected. No dashboard PNG was supplied, so the bundled HTML guided its layout. Explicit requirements take priority over the older prototype: no Browse by Status section or event thumbnails, no mock business logic, and no invented participant City field. Required phone/date fields, edit actions, descriptions, and preview notices extend the supplied screenshots. No pixel-perfect claim is made.

Mock timestamps and descriptions not present in the reference were added as sample content. Seat summaries are display fixtures, not capacity enforcement. Replace these with server-provided data during integration.

## Browser verification

`npm run test:ui` uses installed Google Chrome through Playwright. Tests cover all routes, modal keyboard focus, mobile overflow/navigation, filters, display states, and the absence of fake login or mutations. Screenshots are written to ignored `artifacts/`. `npm run format:check` checks formatting; no ESLint configuration is installed.

If your shell selects an older Node before Volta, put Volta first in your PATH before running npm:

\`\`\`sh
export PATH="$HOME/.volta/bin:$PATH"
node --version
npm run dev
\`\`\`

```

# src/app/App.tsx

```tsx
import { RouterProvider } from "react-router";
import { router } from "./router";
export function App() {
  return <RouterProvider router={router} />;
}

```

# src/app/router.tsx

```tsx
import { createBrowserRouter, Link } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { EventsPage } from "../features/events/pages/EventsPage";
import { EventDetailsPage } from "../features/events/pages/EventDetailsPage";
import { ParticipantsPage } from "../features/participants/pages/ParticipantsPage";
import { RegistrationsPage } from "../features/registrations/pages/RegistrationsPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/events", element: <EventsPage /> },
      { path: "/events/:eventId", element: <EventDetailsPage /> },
      { path: "/participants", element: <ParticipantsPage /> },
      { path: "/registrations", element: <RegistrationsPage /> },
      {
        path: "*",
        element: (
          <>
            <h1 className="text-3xl">Page not found</h1>
            <Link className="text-accent" to="/">
              Return to overview
            </Link>
          </>
        ),
      },
    ],
  },
]);

```

# src/components/layout/AppLayout.tsx

```tsx
import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Brand } from "./Brand";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="fixed left-4 top-2 z-50 -translate-y-24 rounded bg-accent p-3 text-page focus:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-[236px] md:block">
        <Sidebar />
      </aside>
      <div className="flex items-center justify-between bg-sidebar p-4 md:hidden">
        <Brand />
        <Button aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu size={20} />
        </Button>
      </div>
      {open && (
        <Modal title="Navigation" onClose={() => setOpen(false)}>
          <Sidebar onNavigate={() => setOpen(false)} />
        </Modal>
      )}
      <main
        id="main"
        className="flex min-h-dvh flex-col gap-6 p-5 md:ml-[236px] md:p-8"
      >
        <Outlet />
      </main>
    </div>
  );
}

```

# src/components/layout/Brand.tsx

```tsx
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

```

# src/components/layout/Sidebar.tsx

```tsx
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

```

# src/components/ui/Button.tsx

```tsx
import type { ButtonHTMLAttributes } from "react";
export function Button({
  primary = false,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm leading-[1.25] transition-colors disabled:opacity-50 ${primary ? "border-accent bg-accent text-page hover:bg-accent/90" : "border-border bg-surface text-ink hover:bg-elevated"} ${className}`}
      {...props}
    />
  );
}

```

# src/components/ui/CapacityBar.tsx

```tsx
export function CapacityBar({
  used,
  capacity,
  large = false,
}: {
  used: number;
  capacity: number;
  large?: boolean;
}) {
  return (
    <div
      role="progressbar"
      aria-label="Seat utilization"
      aria-valuenow={used}
      aria-valuemin={0}
      aria-valuemax={capacity}
      className={`overflow-hidden rounded bg-border ${large ? "h-3.5" : "h-2"}`}
    >
      <div
        className="h-full rounded bg-accent"
        style={{
          width: `${capacity > 0 ? Math.min(100, (used / capacity) * 100) : 0}%`,
        }}
      />
    </div>
  );
}

```

# src/components/ui/Fields.tsx

```tsx
import { useId } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
export const fieldClass =
  "min-h-9 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm leading-[1.25] text-ink placeholder:text-muted/70";
export const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-[0.06em] text-muted";
export function Input({
  label,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label className="block" htmlFor={inputId}>
      <span className={labelClass}>{label}</span>
      <input id={inputId} className={fieldClass} {...props} />
    </label>
  );
}
export function Select({
  label,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label className="block" htmlFor={inputId}>
      <span className={labelClass}>{label}</span>
      <select id={inputId} className={fieldClass} {...props}>
        {children}
      </select>
    </label>
  );
}
export function Textarea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea className={fieldClass} rows={3} {...props} />
    </label>
  );
}

```

# src/components/ui/ListState.tsx

```tsx
import { AlertCircle, LoaderCircle, SearchX } from "lucide-react";
import { fieldClass } from "./Fields";
export type PreviewState = "ready" | "loading" | "empty" | "error";
export function StatePreview({
  value,
  onChange,
}: {
  value: PreviewState;
  onChange: (state: PreviewState) => void;
}) {
  return (
    <details className="text-xs text-muted">
      <summary className="w-fit cursor-pointer">Preview display states</summary>
      <label className="mt-2 flex max-w-xs items-center gap-3">
        Display state
        <select
          className={fieldClass}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            if (
              next === "ready" ||
              next === "loading" ||
              next === "empty" ||
              next === "error"
            )
              onChange(next);
          }}
        >
          <option value="ready">Default</option>
          <option value="loading">Loading</option>
          <option value="empty">Empty</option>
          <option value="error">Error</option>
        </select>
      </label>
    </details>
  );
}
export function ListState({
  state,
  noun,
}: {
  state: Exclude<PreviewState, "ready">;
  noun: string;
}) {
  const Icon =
    state === "loading"
      ? LoaderCircle
      : state === "error"
        ? AlertCircle
        : SearchX;
  return (
    <div
      role={state === "error" ? "alert" : "status"}
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-8 text-muted"
    >
      <Icon
        size={24}
        className={state === "loading" ? "motion-safe:animate-spin" : ""}
      />
      <p>
        {state === "loading"
          ? `Loading ${noun}…`
          : state === "error"
            ? `Unable to load ${noun}.`
            : `No ${noun} match these filters.`}
      </p>
      {state === "error" && (
        <p className="text-xs">
          This is an error-state preview. Choose Default to return to the sample
          data.
        </p>
      )}
    </div>
  );
}

```

# src/components/ui/Modal.tsx

```tsx
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[462px] overflow-y-auto rounded-card border border-border bg-surface p-5 text-ink shadow-xl backdrop:bg-sidebar/70"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-2xl">
          {title}
        </h2>
        <Button
          aria-label="Close dialog"
          onClick={onClose}
          className="!min-h-8 !p-1.5"
        >
          <X size={16} />
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function ConfirmDialog({
  title,
  description,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-4 text-muted">{description}</p>
      {!onConfirm && <PreviewNotice />}
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Go back</Button>
        <Button primary disabled={!onConfirm} onClick={onConfirm}>
          {title}
        </Button>
      </div>
    </Modal>
  );
}
export function PreviewNotice() {
  return (
    <p className="text-xs leading-relaxed text-muted">
      UI preview only. Submission will be available when this form is connected.
    </p>
  );
}

```

# src/components/ui/PageHeader.tsx

```tsx
import type { ReactNode } from "react";
export function PageHeader({
  title,
  section = title,
  action,
}: {
  title: string;
  section?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.06em] text-muted">
          EventHub / {section}
        </p>
        <h1 className="text-[32px] leading-[1.25]">{title}</h1>
      </div>
      {action}
    </header>
  );
}

```

# src/components/ui/StatusBadge.tsx

```tsx
import type { EventStatus, RegistrationStatus } from "../../types";
const colors = {
  published: "bg-success-bg text-success",
  confirmed: "bg-success-bg text-success",
  draft: "bg-warning-bg text-accent",
  pending: "bg-warning-bg text-accent",
  cancelled: "bg-danger-bg text-danger",
};
export function StatusBadge({
  status,
}: {
  status: EventStatus | RegistrationStatus;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${colors[status]}`}
    >
      {status}
    </span>
  );
}

```

# src/components/ui/StatusFilters.tsx

```tsx
import { Button } from "./Button";
export function StatusFilters<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by status"
    >
      {options.map((option) => (
        <Button
          key={option}
          primary={value === option}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className="capitalize"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

```

# src/data/mockData.ts

```ts
import type { Event, Participant, Registration, User } from "../types";
export const users: User[] = [
  { id: "u1", email: "admin@eventhub.ma", role: "admin" },
];
export const events: Event[] = [
  {
    id: "e1",
    title: "React Workshop",
    description:
      "A hands-on workshop exploring modern React, component composition, and building thoughtful user interfaces.",
    location: "Casablanca",
    eventDate: "2026-11-14T09:00:00Z",
    maxParticipants: 60,
    status: "published",
    createdBy: "u1",
  },
  {
    id: "e2",
    title: "Node.js Conference",
    description:
      "Meet the community and explore the latest ideas in building applications with Node.js.",
    location: "Rabat",
    eventDate: "2026-11-28T09:00:00Z",
    maxParticipants: 120,
    status: "published",
    createdBy: "u1",
  },
  {
    id: "e3",
    title: "AI Engineering Meetup",
    description:
      "An intimate community meetup to exchange practical approaches to AI engineering.",
    location: "Marrakech",
    eventDate: "2026-12-06T10:00:00Z",
    maxParticipants: 6,
    status: "published",
    createdBy: "u1",
  },
  {
    id: "e4",
    title: "Cloud Computing Day",
    description:
      "A day of conversations about cloud infrastructure and application development.",
    location: "Beni Mellal",
    eventDate: "2026-12-19T09:00:00Z",
    maxParticipants: 80,
    status: "draft",
    createdBy: "u1",
  },
  {
    id: "e5",
    title: "Cybersecurity Workshop",
    description:
      "Explore practical security fundamentals with the local developer community.",
    location: "Casablanca",
    eventDate: "2026-10-18T09:00:00Z",
    maxParticipants: 30,
    status: "cancelled",
    createdBy: "u1",
  },
];
export const participants: Participant[] = [
  {
    id: "p1",
    fullName: "Yasmine El Idrissi",
    email: "yasmine@mail.ma",
    phone: "+212 612 345 678",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "p2",
    fullName: "Omar Bennani",
    email: "omar.b@mail.ma",
    phone: null,
    createdAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "p3",
    fullName: "Salma Tazi",
    email: "salma.tazi@mail.ma",
    phone: "+212 623 456 789",
    createdAt: "2026-10-03T10:00:00Z",
  },
  {
    id: "p4",
    fullName: "Karim Alaoui",
    email: "karim@mail.ma",
    phone: null,
    createdAt: "2026-10-04T10:00:00Z",
  },
  {
    id: "p5",
    fullName: "Imane Chraibi",
    email: "imane.c@mail.ma",
    phone: null,
    createdAt: "2026-10-05T10:00:00Z",
  },
  {
    id: "p6",
    fullName: "Hamza Berrada",
    email: "hamza@mail.ma",
    phone: "+212 634 567 890",
    createdAt: "2026-10-06T10:00:00Z",
  },
  {
    id: "p7",
    fullName: "Nadia Lahlou",
    email: "nadia.l@mail.ma",
    phone: null,
    createdAt: "2026-10-07T10:00:00Z",
  },
];
const registrationRows: [string, string, Registration["status"]][] = [
  ["p1", "e1", "confirmed"],
  ["p2", "e1", "confirmed"],
  ["p3", "e1", "pending"],
  ["p4", "e2", "confirmed"],
  ["p5", "e2", "pending"],
  ["p6", "e2", "confirmed"],
  ["p1", "e3", "confirmed"],
  ["p2", "e3", "confirmed"],
  ["p3", "e3", "pending"],
  ["p4", "e3", "confirmed"],
  ["p5", "e3", "confirmed"],
  ["p6", "e3", "pending"],
  ["p7", "e5", "cancelled"],
  ["p1", "e5", "cancelled"],
];
export const registrations: Registration[] = registrationRows.map(
  ([participantId, eventId, status], i) => ({
    id: `r${i}`,
    participantId,
    eventId,
    status,
    createdAt: "2026-10-12T12:00:00Z",
  }),
);
// Presentation summaries supplied independently of domain records, ready for API data.
export const eventSummaries: Record<
  string,
  { occupied: number; available: number }
> = {
  e1: { occupied: 3, available: 57 },
  e2: { occupied: 3, available: 117 },
  e3: { occupied: 6, available: 0 },
  e4: { occupied: 0, available: 80 },
  e5: { occupied: 0, available: 30 },
};
export const dashboardStats = [
  { label: "Total events", value: 5, note: "1 draft" },
  { label: "Published", value: 3, note: "open for registration" },
  { label: "Participants", value: 7, note: "in directory" },
  { label: "Active registrations", value: 12, note: "pending + confirmed" },
];
export const registrationSummary = [
  { status: "confirmed", count: 8 },
  { status: "pending", count: 4 },
  { status: "cancelled", count: 2 },
] as const;
export const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

```

# src/features/auth/pages/LoginPage.tsx

```tsx
import { useState } from "react";
import { Link } from "react-router";
import { CalendarDays } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Fields";
import { StatePreview } from "../../../components/ui/ListState";
import type { PreviewState } from "../../../components/ui/ListState";
export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<PreviewState>("ready");
  return (
    <main className="grid min-h-dvh md:grid-cols-[1.073fr_1fr]">
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
        <div
          className="hidden h-16 items-end gap-1.5 md:flex"
          aria-hidden="true"
        >
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
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-[360px] md:translate-y-8">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Sign in is not connected in this UI preview.");
            }}
          >
            <h2 className="text-[30px]">Sign in</h2>
            <Input
              label="Email"
              type="email"
              autoComplete="username"
              placeholder="admin@eventhub.ma"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  label="Password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </div>
            {(message || state === "error") && (
              <p
                role="alert"
                className="rounded-lg bg-danger-bg p-3 text-danger"
              >
                {state === "error"
                  ? "Unable to sign in. Error presentation preview."
                  : message}
              </p>
            )}
            <Button primary type="submit" disabled={state === "loading"}>
              {state === "loading" ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-[13px] text-muted">
              UI preview only. Authentication is not connected.
            </p>
          </form>
          <div className="mt-5 flex flex-col gap-4">
            <Link to="/" className="text-xs text-accent hover:underline">
              Explore the interface preview →
            </Link>
            <StatePreview
              value={state}
              onChange={(next) => {
                setState(next);
                if (next === "empty") {
                  setEmail("");
                  setPassword("");
                  setMessage("");
                }
              }}
            />
            {state === "empty" && (
              <p className="text-xs text-muted">Empty form preview.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

```

# src/features/dashboard/pages/DashboardPage.tsx

```tsx
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

```

# src/features/events/components/EventForm.tsx

```tsx
import { useState } from "react";
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
    initialValues ?? {
      title: "",
      description: "",
      location: "",
      eventDate: "",
      maxParticipants: 50,
    },
  );
  return (
    <Modal title={initialValues ? "Edit event" : "New event"} onClose={onClose}>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(values);
        }}
      >
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
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Event date (UTC)"
            type="datetime-local"
            required
            value={values.eventDate.slice(0, 16)}
            onChange={(e) =>
              setValues({
                ...values,
                eventDate: e.target.value ? `${e.target.value}:00Z` : "",
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
          <Button onClick={onClose}>Cancel</Button>
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

# src/features/events/components/EventsTable.tsx

```tsx
import { Link } from "react-router";
import { Pencil } from "lucide-react";
import type { Event } from "../../../types";
import { dateLabel } from "../../../data/mockData";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { CapacityBar } from "../../../components/ui/CapacityBar";
interface EventsTableProps {
  events: Event[];
  summaries: Record<string, { occupied: number }>;
  onEdit: (event: Event) => void;
  onAction: (action: string, event: Event) => void;
}
export function EventsTable({
  events,
  summaries,
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
                {summaries[event.id]?.occupied ?? 0}/{event.maxParticipants}
                <CapacityBar
                  used={summaries[event.id]?.occupied ?? 0}
                  capacity={event.maxParticipants}
                />
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button
                    aria-label={`Edit ${event.title}`}
                    onClick={() => onEdit(event)}
                    className="!px-2"
                  >
                    <Pencil size={14} />
                  </Button>
                  {event.status === "draft" && (
                    <>
                      <Button onClick={() => onAction("Publish event", event)}>
                        Publish
                      </Button>
                      <Button onClick={() => onAction("Delete event", event)}>
                        Delete
                      </Button>
                    </>
                  )}
                  {event.status === "published" && (
                    <Button
                      className="whitespace-nowrap"
                      onClick={() => onAction("Cancel event", event)}
                    >
                      Cancel event
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

# src/features/events/pages/EventDetailsPage.tsx

```tsx
import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  events,
  registrations,
  participants,
  users,
  eventSummaries,
  dateLabel,
} from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { CapacityBar } from "../../../components/ui/CapacityBar";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { EventForm } from "../components/EventForm";
export function EventDetailsPage() {
  const { eventId } = useParams();
  const event = events.find((item) => item.id === eventId);
  const [edit, setEdit] = useState(false);
  const [action, setAction] = useState("");
  if (!event)
    return (
      <>
        <PageHeader title="Event not found" section="Events" />
        <p className="text-muted">This event is not in the preview data.</p>
        <Link to="/events" className="text-accent">
          Back to events
        </Link>
      </>
    );
  const summary = eventSummaries[event.id];
  const creator = users.find((user) => user.id === event.createdBy);
  return (
    <>
      <PageHeader
        title={event.title}
        section="Events"
        action={
          <div className="flex gap-2">
            <Button onClick={() => setEdit(true)}>Edit event</Button>
            {event.status !== "cancelled" && (
              <Button
                primary
                onClick={() =>
                  setAction(
                    event.status === "draft" ? "Publish event" : "Cancel event",
                  )
                }
              >
                {event.status === "draft" ? "Publish" : "Cancel event"}
              </Button>
            )}
          </div>
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
            {summary.occupied}
            <span className="text-xl text-muted">
              {" "}
              / {event.maxParticipants}
            </span>
          </p>
          <CapacityBar
            large
            used={summary.occupied}
            capacity={event.maxParticipants}
          />
          <div aria-hidden="true" className="flex flex-wrap gap-[5px]">
            {Array.from(
              { length: Math.min(event.maxParticipants, 120) },
              (_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full ${i < summary.occupied ? "bg-accent" : "bg-border"}`}
                />
              ),
            )}
          </div>
          <p className="text-muted">{summary.available} spots available</p>
          <Link
            to="/events"
            className="rounded-lg border border-border px-3.5 py-2 text-center hover:bg-elevated"
          >
            Back to events
          </Link>
        </section>
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="text-xl">Registrations</h2>
          <div className="mt-2">
            {registrations
              .filter((row) => row.eventId === event.id)
              .map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 border-b border-border py-2.5"
                >
                  <span>
                    {
                      participants.find(
                        (person) => person.id === row.participantId,
                      )?.fullName
                    }
                  </span>
                  <StatusBadge status={row.status} />
                </div>
              ))}
            {!registrations.some((row) => row.eventId === event.id) && (
              <p className="py-6 text-muted">
                No registrations for this event.
              </p>
            )}
          </div>
        </section>
      </div>
      <section className="rounded-card border border-border bg-surface p-5">
        <h2 className="text-xl">About this event</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {event.description}
        </p>
        {creator && (
          <p className="mt-4 text-xs text-muted">Created by {creator.email}</p>
        )}
      </section>
      {edit && (
        <EventForm initialValues={event} onClose={() => setEdit(false)} />
      )}
      {action && (
        <ConfirmDialog
          title={action}
          description={`Review this action for “${event.title}”. This is a presentation-only dialog.`}
          onClose={() => setAction("")}
        />
      )}
    </>
  );
}

```

# src/features/events/pages/EventsPage.tsx

```tsx
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

```

# src/features/participants/components/ParticipantForm.tsx

```tsx
import { useState } from "react";
import type { Participant } from "../../../types";
import { Modal, PreviewNotice } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
export type ParticipantFormValues = Pick<
  Participant,
  "fullName" | "email" | "phone"
>;
export function ParticipantForm({
  initialValues,
  onClose,
  onSubmit,
  loading = false,
  error,
}: {
  initialValues?: ParticipantFormValues;
  onClose: () => void;
  onSubmit?: (values: ParticipantFormValues) => void;
  loading?: boolean;
  error?: string;
}) {
  const [values, setValues] = useState<ParticipantFormValues>(
    initialValues ?? { fullName: "", email: "", phone: null },
  );
  return (
    <Modal
      title={initialValues ? "Edit participant" : "Add participant"}
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(values);
        }}
      >
        <Input
          label="Full name"
          required
          value={values.fullName}
          onChange={(e) => setValues({ ...values, fullName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          value={values.phone ?? ""}
          onChange={(e) =>
            setValues({ ...values, phone: e.target.value || null })
          }
        />
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
        {!onSubmit && <PreviewNotice />}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary type="submit" disabled={!onSubmit || loading}>
            {loading ? "Saving…" : "Save participant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

```

# src/features/participants/pages/ParticipantsPage.tsx

```tsx
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Participant } from "../../../types";
import { participants, dateLabel } from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { fieldClass } from "../../../components/ui/Fields";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { StatePreview, ListState } from "../../../components/ui/ListState";
import type { PreviewState } from "../../../components/ui/ListState";
import { ParticipantForm } from "../components/ParticipantForm";
export function ParticipantsPage() {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Participant | "new" | null>(null);
  const [remove, setRemove] = useState<Participant | null>(null);
  const [state, setState] = useState<PreviewState>("ready");
  const visible = participants.filter((person) =>
    `${person.fullName} ${person.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title="Participants"
        action={
          <Button primary onClick={() => setForm("new")}>
            Add participant
          </Button>
        }
      />
      <input
        aria-label="Search participants"
        placeholder="Search name or email"
        className={`${fieldClass} max-w-[360px]`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {state === "ready" && visible.length ? (
        <div className="relative overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[800px] border-collapse [&_td]:py-2">
            <caption className="sr-only">Participant directory</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((person) => (
                <tr key={person.id}>
                  <td>{person.fullName}</td>
                  <td>{person.email}</td>
                  <td className="whitespace-nowrap text-muted">
                    {person.phone ?? "—"}
                  </td>
                  <td className="whitespace-nowrap">
                    {dateLabel(person.createdAt)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button
                        aria-label={`Edit ${person.fullName}`}
                        onClick={() => setForm(person)}
                        className="!min-h-7 !p-1.5"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        aria-label={`Delete ${person.fullName}`}
                        onClick={() => setRemove(person)}
                        className="!min-h-7 !p-1.5"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ListState
          state={state === "ready" ? "empty" : state}
          noun="participants"
        />
      )}
      <StatePreview value={state} onChange={setState} />
      {form && (
        <ParticipantForm
          initialValues={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
        />
      )}
      {remove && (
        <ConfirmDialog
          title="Delete participant"
          description={`Review deletion of ${remove.fullName}. This preview does not delete any records.`}
          onClose={() => setRemove(null)}
        />
      )}
    </>
  );
}

```

# src/features/registrations/components/RegistrationForm.tsx

```tsx
import { useState } from "react";
import type { Event, Participant } from "../../../types";
import { Select } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/Modal";
export interface RegistrationFormValues {
  participantId: string;
  eventId: string;
}
export function RegistrationForm({
  events,
  participants,
  onSubmit,
}: {
  events: Event[];
  participants: Participant[];
  onSubmit?: (values: RegistrationFormValues) => void;
}) {
  const [values, setValues] = useState({
    participantId: participants[0]?.id ?? "",
    eventId: events[0]?.id ?? "",
  });
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <form
        className="flex flex-wrap items-end gap-3 rounded-card border border-border bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setConfirm(true);
        }}
      >
        <div className="flex-[1_1_200px]">
          <Select
            label="Participant"
            value={values.participantId}
            onChange={(e) =>
              setValues({ ...values, participantId: e.target.value })
            }
          >
            {participants.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-[1_1_200px]">
          <Select
            label="Event"
            value={values.eventId}
            onChange={(e) => setValues({ ...values, eventId: e.target.value })}
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.status})
              </option>
            ))}
          </Select>
        </div>
        <Button primary type="submit">
          Register participant
        </Button>
      </form>
      {confirm && (
        <ConfirmDialog
          title="Register participant"
          description={`${participants.find((person) => person.id === values.participantId)?.fullName} — ${events.find((event) => event.id === values.eventId)?.title}`}
          onClose={() => setConfirm(false)}
          onConfirm={onSubmit ? () => onSubmit(values) : undefined}
        />
      )}
    </>
  );
}

```

# src/features/registrations/pages/RegistrationsPage.tsx

```tsx
import { useState } from "react";
import { Link } from "react-router";
import type { RegistrationStatus } from "../../../types";
import {
  registrations,
  participants,
  events,
  dateLabel,
} from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { fieldClass } from "../../../components/ui/Fields";
import { StatusFilters } from "../../../components/ui/StatusFilters";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { StatePreview, ListState } from "../../../components/ui/ListState";
import type { PreviewState } from "../../../components/ui/ListState";
import { EventForm } from "../../events/components/EventForm";
import { RegistrationForm } from "../components/RegistrationForm";
export function RegistrationsPage() {
  const [status, setStatus] = useState<"all" | RegistrationStatus>("all");
  const [eventId, setEventId] = useState("all");
  const [create, setCreate] = useState(false);
  const [action, setAction] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [state, setState] = useState<PreviewState>("ready");
  const visible = registrations.filter(
    (row) =>
      (status === "all" || row.status === status) &&
      (eventId === "all" || row.eventId === eventId),
  );
  return (
    <>
      <PageHeader
        title="Registrations"
        action={
          <Button primary onClick={() => setCreate(true)}>
            New event
          </Button>
        }
      />
      <RegistrationForm events={events} participants={participants} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilters
          options={["all", "pending", "confirmed", "cancelled"] as const}
          value={status}
          onChange={setStatus}
        />
        <select
          aria-label="Filter registrations by event"
          className={`${fieldClass} !w-auto max-w-full`}
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="all">All events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>
      {state === "ready" && visible.length ? (
        <div className="relative overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[850px] border-collapse">
            <caption className="sr-only">Event registrations</caption>
            <thead>
              <tr>
                <th>Participant</th>
                <th>Event</th>
                <th>Status</th>
                <th>Created</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const person = participants.find(
                  (item) => item.id === row.participantId,
                );
                const event = events.find((item) => item.id === row.eventId);
                return (
                  <tr key={row.id}>
                    <td>
                      {person?.fullName}
                      <p className="text-[13px] leading-tight text-muted">
                        {person?.email}
                      </p>
                    </td>
                    <td>
                      <Link
                        className="hover:text-accent"
                        to={`/events/${row.eventId}`}
                      >
                        {event?.title}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="whitespace-nowrap text-muted">
                      {dateLabel(row.createdAt)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {row.status === "pending" && (
                          <Button
                            onClick={() =>
                              setAction({
                                title: "Confirm registration",
                                description: `${person?.fullName} — ${event?.title}`,
                              })
                            }
                          >
                            Confirm
                          </Button>
                        )}
                        {row.status !== "cancelled" && (
                          <Button
                            onClick={() =>
                              setAction({
                                title: "Cancel registration",
                                description: `${person?.fullName} — ${event?.title}`,
                              })
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <ListState
          state={state === "ready" ? "empty" : state}
          noun="registrations"
        />
      )}
      <StatePreview value={state} onChange={setState} />
      {create && <EventForm onClose={() => setCreate(false)} />}
      {action && <ConfirmDialog {...action} onClose={() => setAction(null)} />}
    </>
  );
}

```

# src/index.css

```css
@import "tailwindcss";
@font-face {
  font-family: Mulish;
  src: url("/fonts/mulish-latin.woff2") format("woff2");
  font-style: normal;
  font-weight: 200 1000;
  font-display: swap;
}
@theme {
  --font-sans: Mulish, system-ui, sans-serif;
  --color-page: #11222d;
  --color-sidebar: #0d1b25;
  --color-surface: #1b3140;
  --color-elevated: #234157;
  --color-input: #0f1e28;
  --color-accent: #f5b50f;
  --color-coral: #f2573a;
  --color-green: #12a072;
  --color-ink: #eaf0f3;
  --color-muted: #8fa3b0;
  --color-border: #27435a;
  --color-success-bg: #0f3f34;
  --color-success: #5fe0b4;
  --color-warning-bg: #4a3b0e;
  --color-danger-bg: #4a1f1a;
  --color-danger: #ff8a73;
  --radius-card: 14px;
}
@layer base {
  body {
    @apply m-0 bg-page font-sans text-sm leading-[1.25] text-ink;
  }
  h1,
  h2,
  h3 {
    @apply font-extrabold tracking-[-0.01em];
  }
  button,
  a,
  input,
  select,
  textarea {
    @apply outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent;
  }
  button:not(:disabled),
  select {
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  input,
  select,
  textarea {
    color-scheme: dark;
  }
  th {
    @apply border-b border-border px-3 py-2.5 text-left text-xs font-bold text-muted;
  }
  td {
    @apply border-b border-border px-3 py-3 align-middle;
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
  tbody tr:hover {
    @apply bg-elevated/40;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
}

```

# src/main.tsx

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./index.css";
const root = document.getElementById("root");
if (!root) throw new Error("Root element is missing");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

# src/types/index.ts

```ts
export type Role = "admin" | "staff";
export type EventStatus = "draft" | "published" | "cancelled";
export type RegistrationStatus = "pending" | "confirmed" | "cancelled";
export interface User {
  id: string;
  email: string;
  role: Role;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  maxParticipants: number;
  status: EventStatus;
  createdBy: string;
}
export interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}
export interface Registration {
  id: string;
  eventId: string;
  participantId: string;
  status: RegistrationStatus;
  createdAt: string;
}

```

# test-results/.last-run.json

```json
{
  "status": "passed",
  "failedTests": []
}
```

# tests/ui.spec.ts

```ts
import { test, expect } from "@playwright/test";

test("all screens render without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [route, title] of [
    ["/", "Overview"],
    ["/events", "Events"],
    ["/events/e1", "React Workshop"],
    ["/participants", "Participants"],
    ["/registrations", "Registrations"],
    ["/login", "Sign in"],
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/${route === "/" ? "dashboard" : route.slice(1).replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("event search and modal are presentation only and keyboard accessible", async ({
  page,
}) => {
  await page.goto("/events");
  await page
    .getByRole("textbox", { name: "Search events or city" })
    .fill("Rabat");
  await expect(
    page.getByRole("link", { name: "Node.js Conference" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "React Workshop" })).toHaveCount(
    0,
  );
  await page.getByRole("textbox", { name: "Search events or city" }).fill("");
  await page.getByRole("button", { name: "New event", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Title", { exact: true }).fill("Unpersisted event");
  await expect(
    dialog.getByRole("button", { name: "Create draft" }),
  ).toBeDisabled();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document.querySelector("dialog")?.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New event", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("row")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Cancel event", exact: true })
    .first()
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Cancel event", exact: true }),
  ).toBeDisabled();
});

test("registration filters and display states do not mutate data", async ({
  page,
}) => {
  await page.goto("/registrations");
  await page.getByRole("button", { name: /^pending$/i }).click();
  await expect(page.getByRole("row")).toHaveCount(5);
  await page.getByLabel("Filter registrations by event").selectOption("e1");
  await expect(page.getByRole("row")).toHaveCount(2);
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Confirm registration" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await page.getByText("Preview display states", { exact: true }).click();
  await page.getByLabel("Display state").selectOption("error");
  await expect(page.getByRole("alert")).toContainText("Unable to load");
  await page.getByLabel("Display state").selectOption("empty");
  await expect(page.getByRole("status")).toContainText("No registrations");
  await page.getByLabel("Display state").selectOption("ready");
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("login never authenticates and password visibility toggles", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("preview-password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("not connected");
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
});

test("mobile screens do not overflow and navigation closes after selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/events",
    "/events/e1",
    "/participants",
    "/registrations",
    "/login",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/mobile-${route === "/" ? "dashboard" : route.slice(1).replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Participants", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Participants", exact: true }),
  ).toBeVisible();
});

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src", "vite.config.ts"]
}

```

# vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({ plugins: [react(), tailwindcss()] });

```

