# Department Module (Clean Architecture)

This module mirrors the same boundaries as organization:

- domain: entities + repository contracts
- application: use cases
- infrastructure: db schema + repository adapter
- composition root: department-module.server.ts
- presentation: app/routes/departments.tsx
