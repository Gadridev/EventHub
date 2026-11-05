# EventHub Frontend

React 19 and TypeScript application for EventHub, using Vite, Tailwind CSS 4, React Router 7, Axios, and TanStack Query 5.

See the [root README](../README.md) for installation, environment configuration, database setup, demo accounts, API documentation, and business rules.

## Development

From this directory, after following the root setup instructions:

```sh
npm run dev
npm run typecheck
npm run build
npm run preview
```

Use Node 24.14.0 and npm 11.9.0 as pinned by Volta. `VITE_API_URL` must include the backend's `/api` prefix. Restart Vite after changing it.

## Structure

- `src/app`: application providers and protected routing.
- `src/features`: Auth, Dashboard, Events, Participants, and the reusable Registrations domain.
- `src/components`: shared layout, fields, dialogs, status badges, and capacity displays.
- `src/lib`: shared Axios interceptors, token storage, QueryClient, dates, and error messages.
- `public/fonts`: locally hosted Mulish and its license.

Routes are `/login`, `/`, `/events`, `/events/:eventId`, and `/participants`. Registration creation and status management live inside Event Details; there is no standalone Registrations page. Dashboard and all core feature pages use real API data.

API services handle HTTP requests; custom TanStack Query hooks handle fetching, mutations, and invalidation. React Context coordinates authentication, while forms use local state. Temporary session-verification failures offer Retry; protected API 401 responses expire the session.

## Checks

`npm run typecheck` checks TypeScript and `npm run build` creates the production bundle. No frontend test runner is configured. `npm run format:check` checks Prettier formatting.
