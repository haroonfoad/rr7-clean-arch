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
- Drizzle ORM + PostgreSQL (`pg`)

## Run the app

```bash
npm install
npm run dev
```

Add `.env` with your DB connection string:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost/clean_delta"
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

## Localization

Current supported locales:

- `en`
- `ar` (RTL)
- `ru`

Localization is implemented with `i18next` + `react-i18next` and persisted via a `locale` cookie.

Canonical locale strategy is URL-based routing with `/:locale/*` paths, for example:

- `/en`
- `/ar/login`
- `/ru/organizations`

Translation files are JSON-based for Weblate compatibility:

- `app/modules/localization/infrastructure/i18n/locales/en/common.json`
- `app/modules/localization/infrastructure/i18n/locales/ar/common.json`
- `app/modules/localization/infrastructure/i18n/locales/ru/common.json`

Language switching updates the first URL segment to the selected locale while preserving the current route.

## Drizzle commands

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

The `organizations`, `departments`, and `users` tables are managed in PostgreSQL through Drizzle migration files.

Migrations are generated from module schemas under `app/modules/**/infrastructure/db/schema.ts` into the `drizzle/` folder.

Recommended workflow when schema changes:

1. Update module schema files.
2. Run `npm run db:generate`.
3. Commit generated migration files.
4. Run `npm run db:migrate` in deployment/startup.
5. Run `npm run db:seed` for idempotent bootstrap data (default auth user).

`dev` and `start` automatically run migration and seed first via `predev` and `prestart` scripts.

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
