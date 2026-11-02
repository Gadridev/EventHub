# EventHub

Backend infrastructure for an Express, TypeScript, PostgreSQL, and Prisma 7 application. This setup intentionally contains no application models, enums, migrations, seed data, or business features.

## Requirements

- Node.js `^20.19`, `^22.12`, or `^24.0`
- npm
- PostgreSQL, or Docker Desktop with Docker Compose

The server uses ESM and strict TypeScript. Run all npm commands below from `server/`.

Run `node --version` before installing. Prisma 7 does not support Node 20 releases older than 20.19. This project pins Node 24.14 for Volta users; select that toolchain if another Node installation appears first on your `PATH`.

## Install and configure

```sh
cd server
npm install
cp .env.example .env
```

Change the local database password in `.env` and keep `DATABASE_URL` in sync. The checked-in `.env.example` contains placeholders; `.env` is ignored by Git.

## PostgreSQL

To use the included local PostgreSQL service, start Docker Desktop and run from the repository root:

```sh
docker compose --env-file server/.env up -d postgres
```

The Compose service creates the `eventhub` database but does not create application tables. Its named volume persists database data. To use an existing PostgreSQL server instead, update `server/.env` with its connection URL and do not start Compose.

Verify the real PostgreSQL connection without querying an application table:

```sh
cd server
npm run db:check
```

This command uses the `pg` driver to connect and reads PostgreSQL connection metadata. It is deliberately distinct from a Prisma model query because this project has no models yet.

## Development

```sh
npm run dev
```

The default URL is `http://localhost:3000`. Check the API with:

```sh
curl http://localhost:3000/api/health
```

Other commands:

```sh
npm run typecheck
npm run build
npm start
npm run prisma:validate
npm run prisma:generate
npm run prisma:studio
```

## Add your own Prisma models later

Write models and enums in `server/prisma/schema.prisma`, below the existing generator and datasource blocks. Then validate and generate the client:

```sh
npm run prisma:validate
npm run prisma:generate
```

When you are ready to create your first database migration, review the SQL Prisma will apply and then run:

```sh
npm run prisma:migrate -- --name init
```

That migration command is defined for future use but has not been run by this infrastructure setup. Future migration files belong in `server/prisma/migrations/` and should be committed.

## Layout

- `server/prisma/schema.prisma`: empty application schema; add your models here.
- `server/prisma7.config.ts`: Prisma 7 CLI configuration and migration path.
- `server/src/generated/prisma/`: generated Prisma Client; ignored and recreated by `prisma:generate`.
- `server/src/lib/prisma.ts`: shared Prisma Client using `@prisma/adapter-pg`.
- `server/src/config/check-database.ts`: read-only PostgreSQL connectivity check.
- `server/src/modules/`: space for future feature modules; no features are scaffolded yet.
