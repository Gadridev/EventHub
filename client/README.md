# EventHub UI Lab

Standalone, UI-only React + TypeScript application. All domain data lives in `src/data/mockData.ts`; no authentication, requests, storage, or mutations are implemented.

## Run

Use Node 22.12+ (Node 24 recommended).

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

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

```sh
export PATH="$HOME/.volta/bin:$PATH"
node --version
npm run dev
```
