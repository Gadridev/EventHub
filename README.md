# EventHub
EventHub is an event and registration management application built with the PERN stack: PostgreSQL, Express, React, and Node.js. Admin and Staff users manage Events and Participants, register Participants from Event Details, and monitor attendance through a shared Dashboard.
<img width="2480" height="2124" alt="eventhub-demo" src="https://github.com/user-attachments/assets/32625684-00af-4492-ac2e-a3077a11d53f" />


## Class Diagram
The four domain classes and their relationships:
```mermaid
classDiagram
    direction LR
    class User {

        id

        email

        role

    }
    class Event {

        id

        title

        eventDate

        maxParticipants

        status

    }
    class Participant {

        id

        fullName

        email

        phone

    }
    class Registration {

        id

        status

        createdAt

    }
    User "1" -- "0..*" Event : creates
    Event "1" -- "0..*" Registration : has
    Participant "1" -- "0..*" Registration : has
```

`1` means exactly one; `0..*` means zero or many. Each Registration belongs to one Event and one Participant. The Event/Participant pair is unique. Attributes are simplified; the complete definitions are in the [Prisma schema](server/prisma/schema.prisma).

## Use Case Diagram
Both roles share the core use cases. Event management permissions differ by ownership.
```mermaid
flowchart LR
    Admin["Admin"]
    Staff["Staff"]
    subgraph Shared["Shared use cases"]

        direction TB

        Login([Sign in])

        Dashboard([View Dashboard])

        Events([View and create Events])

        Participants([Manage Participants])

        Registrations([Register Participants and confirm/cancel Registrations])
    end
    Admin --- Shared
    Staff --- Shared
    Admin --- AllEvents([Edit, publish, cancel or delete any Event])
    Staff --- OwnEvents([Edit, publish, cancel or delete own Events])
```

Registration management applies to any Event, regardless of its creator. Creating Registrations and confirming them require a published Event; the remaining validation rules are described below.

## Features
- JWT authentication with Admin and Staff roles.

- Event creation, editing, publishing, cancellation, and deletion.

- Participant directory with name/email search and CRUD operations.

- Registration creation and Confirm/Cancel actions inside Event Details.

- Capacity protection and unique Event/Participant registrations.

- Dashboard with total/published Events, registrations created today (UTC), Top 5 most-filled published Events, upcoming Events, and registration status counts.

- Server-side pagination, Event title search, Event status filtering, and searchable Participant selection.

## Tech Stack
| Frontend | Backend |
| --- | --- |
| React 19, TypeScript, Vite 7 | Node.js, Express 5, TypeScript |
| Tailwind CSS 4 | PostgreSQL, Prisma ORM 7 with the PostgreSQL adapter |
| TanStack Query 5, Axios | JWT authentication, bcrypt password hashing |
| React Router 7 | Zod validation; Jest and Supertest |

The frontend uses feature-based API services and query hooks. Express modules separate routes, controllers, validation, and services. Prisma accesses PostgreSQL through a shared client.

## Project Structure
```text
client/

  src/app/                  Application providers and routing

  src/components/           Shared UI and layout

  src/features/             Auth, Dashboard, Events, Participants, Registrations

  src/lib/                  Axios, authentication storage, query configuration

server/

  prisma/                   Schema, migrations, and seed source

  src/config/               Environment validation and database checks

  src/lib/                  Shared Prisma client

  src/middleware/           Authentication, authorization, and errors

  src/modules/              Feature routes, controllers, schemas, and services

  tests/                    Jest + Supertest API tests
```

## Prerequisites
- **Node.js 24.14.0 and npm 11.9.0 recommended**, matching the frontend Volta configuration. The server supports Node `^20.19.0`, `^22.12.0`, or `^24.0.0`; the frontend requires `>=22.12.0`. Use Node 22.12+ within the 22.x line or Node 24.x for both applications.

- **PostgreSQL 16**, supplied by the included Docker Compose service, or an existing PostgreSQL instance. Other PostgreSQL versions are not verified here.

- Docker with Compose if using the included database service.

There is no root npm workspace or root `package.json`; install and run each application separately.

## Installation
### 1. Clone and install
Replace `<repository-url>` with this repository's clone URL.
```sh
git clone <repository-url> eventhub

cd eventhub

cd server

npm ci

cp .env.example .env

cd ../client

npm ci

cp .env.example .env

cd ..
```

### 2. Configure the environment
Edit `server/.env`: choose a local PostgreSQL password, update `DATABASE_URL` to match, and set a random `JWT_SECRET` of at least 32 characters. For example, generate a secret locally with:
```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Keep the frontend API URL and backend CORS origin aligned with the ports used below. Never put backend secrets in a `VITE_` variable; those values are public browser configuration.

### 3. Start PostgreSQL and apply migrations
From the repository root:
```sh
docker compose --env-file server/.env up -d postgres

cd server

npm run db:check

npm run prisma:migrate

npm run prisma:generate
```

For an existing PostgreSQL installation, create a local database and set `DATABASE_URL` instead of starting Compose. The `prisma:migrate` script uses `prisma migrate dev`; its database user needs permission to create a shadow database. These instructions are for local development.

The Compose database uses a persistent named volume. Changing credentials in `.env` after the volume has been initialized does not reset the existing database credentials.

### 4. Seed demo data

The [seed script](server/prisma/seed.ts) creates two local demo users (Admin and Staff), five Events, ten Participants, and twenty Registrations.

Set `SEED_PASSWORD` in `server/.env` to a local demo password of at least eight characters. From `server/`, run:
```sh
npx tsx prisma/seed.ts
```

The seed refuses to run when `NODE_ENV=production`. Event IDs are generated by Prisma according to the database schema, rather than supplied as hard-coded fixture IDs.

The script uses upserts for existing demo Users, Participants, and Registrations, and looks up Events by title and creator before updating or creating them. Re-running it can restore demo field values and registration statuses; use a local test database, not data you want to preserve.

### 5. Start both applications
Backend terminal, from `server/`:
```sh
npm run dev
```

Frontend terminal, from `client/`:
```sh
npm run dev
```

Open **http://localhost:5173**. The API defaults to **http://localhost:3000/api**. Check backend availability with `curl http://localhost:3000/api/health`.

## Environment Variables
### Backend: `server/.env`
| Variable | Purpose / default |
| --- | --- |
| `DATABASE_URL` | Required PostgreSQL URL. Example: `postgresql://eventhub:LOCAL_PASSWORD@127.0.0.1:5432/eventhub?schema=public`. URL-encode special characters in credentials. |
| `JWT_SECRET` | Required signing secret, at least 32 characters; no default. |
| `NODE_ENV` | `development` (default), `test`, or `production`. |
| `PORT` | API port; default `3000`. |
| `CORS_ORIGIN` | Comma-separated allowed frontend origins; default `http://localhost:5173`. |
| `POSTGRES_USER` | Compose database user; default `eventhub`. |
| `POSTGRES_PASSWORD` | Compose database password; replace the example placeholder and keep the URL synchronized. |
| `POSTGRES_DB` | Compose database name; default `eventhub`. |
| `POSTGRES_PORT` | Compose host port; default `5432`. |
| `SEED_PASSWORD` | Seed-only password, at least eight characters; required when running the seed. Add it to `server/.env` if it is not present in `.env.example`. |

### Frontend: `client/.env`
| Variable | Purpose / example |
| --- | --- |
| `VITE_API_URL` | Backend API root, including `/api`: `http://localhost:3000/api`. |

Restart development servers after changing environment variables. `.env` files, dependencies, build output, and the generated Prisma client are ignored by Git; `.env.example` files contain local placeholders.

## Demo Accounts
The seed creates these **local development accounts** using the value of `SEED_PASSWORD` as their initial password:

| Role | Email |
| --- | --- |
| Admin | `admin@eventhub.test` |
| Staff | `staff@eventhub.test` |

There is no fixed password and no public sign-up endpoint. Re-running the seed updates existing accounts' roles but does not reset their passwords. Use the password assigned when those accounts were first created, or reset the local demo database if you need to change it.

## API Overview
All paths are relative to `/api`. Except for Login and Health, requests require `Authorization: Bearer <token>`; management modules allow Admin and Staff.

| Module | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Health | GET | `/health` | Service availability |
| Authentication | POST | `/auth/login` | Sign in with email/password |
| Authentication | GET | `/auth/me` | Current authenticated user |
| Events | GET / POST | `/events` | List / create |
| Events | GET / PATCH / DELETE | `/events/:id` | Read / edit / delete |
| Events | PATCH | `/events/:id/status` | Publish or cancel |
| Participants | GET / POST | `/participants` | List / create |
| Participants | GET / PATCH / DELETE | `/participants/:id` | Read / edit / delete |
| Registrations | GET / POST | `/registrations` | List / register a Participant |
| Registrations | GET | `/registrations/:id` | Registration details |
| Registrations | PATCH | `/registrations/:id/status` | Confirm or cancel |
| Dashboard | GET | `/dashboard/stats` | Global statistics |

List endpoints use `page` and `limit` (default 1 and 10; maximum limit 100), returning `{ data, pagination }`. Events support `search` by title and `status`; Participants support `search` by name/email; Registrations support `eventId`, `participantId`, and `status`. Single-record and Dashboard responses use `{ data }`; API errors use `{ error }`.

## Business Rules and Permissions
- Both roles can view all Events, manage all Participants, and manage Registrations for **any** Event. Registration management does not depend on Event ownership.

- Admin can edit, publish, cancel, or delete any Event. Staff can perform those Event operations only on Events they created.

- New Events start as `draft`; only published Events accept registrations. Cancelled Events cannot be reopened or edited.

- New Registrations start as `pending`. Pending and confirmed registrations occupy seats; cancelled registrations release seats.

- A Participant can have only one Registration per Event, including historical cancelled registrations. Cancelled Registrations cannot be reactivated.

- Pending Registrations can be confirmed or cancelled; confirmed Registrations can be cancelled. Confirmation requires a published Event.

- Capacity cannot be exceeded. Cancelling an Event cancels all its Registrations.

- Events and Participants with any Registrations cannot be deleted, even if all related Registrations are cancelled.

## Database Design
The [database ERD](docs/database-erd.md) documents actual column names, PostgreSQL types, keys, indexes, cardinalities, and referential actions. The [class diagram](#class-diagram), [Prisma schema](server/prisma/schema.prisma), and [SQL migrations](server/prisma/migrations/) provide additional design references.

- `users`: unique email, hashed password, and role; one User creates many Events.

- `events`: creator foreign key, date, capacity, and status; one Event has many Registrations.

- `participants`: unique email and optional phone; one Participant has many Registrations.

- `registrations`: joins Events and Participants, with a unique `(event_id, participant_id)` constraint, status, and creation timestamp.

Primary keys are UUIDs. Foreign keys restrict deletion of referenced Users, Events, and Participants.

## Tests and Build
From `server/`:
```sh
npm test

npm run build
```

Backend tests use Jest and Supertest with mocked Prisma access; they do not replace live PostgreSQL verification. The build generates Prisma Client. To run the compiled API, use `npm start` after building.

From `client/`:
```sh
npm run typecheck

npm run build
```

No frontend test runner is configured. `npm run preview` serves the frontend production build locally.

For manual evaluation, sign in, create and publish an Event, add a Participant, and register them from Event Details. Confirm and cancel a Registration while checking the seat count. Also check duplicate/full-capacity errors, Staff Event ownership restrictions, and Dashboard refreshes after mutations.

## Notes
- Registration creation and status changes use PostgreSQL transactions and an Event row lock (`SELECT ... FOR UPDATE`) to serialize seat-related operations and prevent concurrent overbooking.

- Dashboard “today” uses UTC midnight inclusive through the next midnight exclusive, regardless of Registration status. Top Events rank published Events by pending/confirmed occupancy percentage, with deterministic ID ordering for ties.

- The frontend stores the JWT in localStorage for this assessment and verifies it through `/auth/me` on reload. Logout and protected API 401 responses clear the session and user-specific query cache.

- Only `docs/database-erd.md` is allowed through the `docs/` ignore rule. Other local documents, including the assessment PDF, remain ignored.
