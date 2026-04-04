# RR7 Clean Architecture Starter

This project contains two CRUD modules (`organizations` and `departments`) built with clean architecture boundaries and React Router v7.

Tables:

- `organizations`: `id`, `name`
- `departments`: `id`, `name`
- `users`: `id`, `username`, `password`

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

## Route structure

The app uses module route folders under `app/routes`:

- `app/routes/organizations/index.tsx`: listing page
- `app/routes/organizations/new.tsx`: create dialog
- `app/routes/organizations/edit.tsx`: edit dialog
- `app/routes/organizations/delete.tsx`: delete confirmation dialog
- `app/routes/departments/index.tsx`: listing page
- `app/routes/departments/new.tsx`: create dialog
- `app/routes/departments/edit.tsx`: edit dialog
- `app/routes/departments/delete.tsx`: delete confirmation dialog

Each module's `index` route renders the table, and child routes render PrimeReact `Dialog` overlays via nested routing.

## Drizzle commands

```bash
npm run db:generate
npm run db:migrate
```

`organization.db` is created automatically on first run, and the `organizations` table is ensured by the infrastructure DB client.

The `departments` table is also ensured automatically by the department infrastructure DB client.

The `users` table is ensured automatically by the auth infrastructure DB client.

## Clean architecture structure

Each module lives in `app/modules/<module-name>` and is split into:

- `domain`: entities and repository contracts
- `application`: use cases (business rules)
- `infrastructure`: Drizzle schema + repository implementations
- `presentation`: UI pages and view concerns (`presentation/pages/*`)
- `<module-name>-module.server.ts`: composition root

Route files under `app/routes/<module-name>/*` are the delivery mechanism for the presentation layer:

- `index.tsx`: renders list page from `presentation/pages/*`
- `new.tsx`, `edit.tsx`, `delete.tsx`: render PrimeReact dialogs and invoke actions

Current UI behavior includes:

- PrimeReact DataTable listing in module index routes
- Dialog routes for create/edit/delete
- Search by id/name (organizations)
- Pagination
- Confirmation dialog before delete

## How to replicate for other modules

1. Create `app/modules/<module-name>` with the same layer folders.
2. Keep entities/contracts in `domain` only.
3. Place business operations as use-case classes in `application/use-cases`.
4. Implement repository adapters in `infrastructure/repositories`.
5. Add a module composition root to wire concrete implementations.
6. In RR7 routes, keep `index.tsx` for listing and use child routes (`new`, `edit`, `delete`) for dialog actions.
7. In route `loader/action`, call use cases instead of direct ORM calls.
