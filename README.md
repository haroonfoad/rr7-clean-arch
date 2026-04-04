# RR7 Clean Architecture Starter

This project contains a simple CRUD example for an `organization` table:

- `id: uuid`
- `name: string`

It now also includes a second `department` module with the same boundaries as a replication template.

Stack used:

- React Router v7 (SSR)
- PrimeReact + PrimeIcons
- Tailwind CSS v4
- Drizzle ORM + SQLite (`better-sqlite3`)

## Run the app

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and navigate to `/organizations`.
Also available: `/departments`.

## Drizzle commands

```bash
npm run db:generate
npm run db:migrate
```

`organization.db` is created automatically on first run, and the `organizations` table is ensured by the infrastructure DB client.

## Clean architecture structure

The organization module is in `app/modules/organization` and is split into:

- `domain`: entities and repository contracts
- `application`: use cases (business rules)
- `infrastructure`: Drizzle schema + repository implementations
- `organization-module.server.ts`: composition root
- `app/routes/organizations.tsx`: presentation layer (thin route)

Organization route UI includes:

- Search by id/name
- Pagination
- Optimistic UI behavior while mutations are in flight

## How to replicate for other modules

1. Create `app/modules/<module-name>` with the same layer folders.
2. Keep entities/contracts in `domain` only.
3. Place business operations as use-case classes in `application/use-cases`.
4. Implement repository adapters in `infrastructure/repositories`.
5. Add a module composition root to wire concrete implementations.
6. In RR7 route `loader/action`, call use cases instead of direct ORM calls.
