# Organization Module (Clean Architecture)

This module is a vertical slice that follows clean architecture boundaries.

## Layers

- Domain
  - `domain/entities/organization.ts`
  - `domain/repositories/organization-repository.ts`
- Application
  - `application/use-cases/*`
- Infrastructure
  - `infrastructure/db/*`
  - `infrastructure/repositories/drizzle-organization-repository.server.ts`
- Composition Root
  - `organization-module.server.ts`
- Presentation
  - `app/routes/organizations.tsx`

## Request flow

1. Route `loader` and `action` call use cases from the composition root.
2. Use cases depend on repository interfaces, not Drizzle.
3. Infrastructure repository implements the interface and uses Drizzle.
4. Domain stays framework-agnostic and reusable.

## Replicate for other modules

1. Copy this folder structure under `app/modules/<module-name>`.
2. Define domain entity and repository interface.
3. Add one use-case file per business operation.
4. Implement repository with Drizzle in infrastructure.
5. Build a composition root `<module-name>-module.server.ts`.
6. Keep route components thin: call use cases from `loader` and `action`.
