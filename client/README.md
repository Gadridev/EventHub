# EventHub UI Lab

React + TypeScript frontend for EventHub. Authentication and Events use the Express backend; Participants, Registrations, and Dashboard still use `src/data/mockData.ts`.

## Run

Use Node 22.12+ (Node 24 recommended).

```sh
npm install
cp .env.example .env
npm run dev
npm run typecheck
npm run build
npm run preview
```

Set `VITE_API_URL` to the backend API root (default in `.env.example`: `http://localhost:3000/api`). Run the frontend at `http://localhost:5173`, matching the backend default `CORS_ORIGIN`. Restart Vite after changing environment variables.

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

Events forms and confirmation dialogs submit to the backend. Forms in the remaining preview features stay disabled until integrated. Login stores only the access token in localStorage and redirects to Dashboard (`/`). Reload verifies the token via `/auth/me`; logout and protected API 401 responses clear the session and query cache. Use the collapsed “Preview display states” controls to inspect loading/error/empty presentations; these do not simulate network activity.

Native dialogs provide focus containment, Escape dismissal, background inertness, and focus restoration. Tables scroll horizontally on narrow screens. Main navigation becomes a modal on mobile.

## Reference decisions

Original references remain untouched in `../design-references`. All six PNGs were inspected. No dashboard PNG was supplied, so the bundled HTML guided its layout. Explicit requirements take priority over the older prototype: no Browse by Status section or event thumbnails, no mock business logic, and no invented participant City field. Required phone/date fields, edit actions, descriptions, and preview notices extend the supplied screenshots. No pixel-perfect claim is made.

Mock timestamps and descriptions not present in the reference were added as sample content. Seat summaries are display fixtures, not capacity enforcement. Replace these with server-provided data during integration.

## Formatting

`npm run format:check` checks formatting; no ESLint configuration is installed.

If your shell selects an older Node before Volta, put Volta first in your PATH before running npm:

```sh
export PATH="$HOME/.volta/bin:$PATH"
node --version
npm run dev
```

## Authentication infrastructure

`src/lib/api.ts` centralizes Axios configuration and interceptors. `src/lib/query-client.ts` supplies one QueryClient with a 60-second stale time, no automatic retries, and no refetch on window focus. `AuthContext` exposes session status and actions while the current user lives in the query cache. The `useCurrentUser` hook owns cancellable session verification; `useLogin` owns the login mutation and session cache initialization. Temporary verification failures retain the token and offer Retry; only protected API 401 responses expire the session. One route guard protects the application layout. Events API integration uses its own query and mutation hooks.

## Events integration

The Events list uses server pagination, title search, status filters, and real seat counts. Detail pages show the creator and capacity data; registration details are deferred until Registrations integration. Event dates are edited in local time and submitted as ISO timestamps. Create, update, publish, cancel, and delete invalidate the `events` query prefix and the reserved `dashboard` prefix. Authorization and conflict checks remain enforced by the backend.
