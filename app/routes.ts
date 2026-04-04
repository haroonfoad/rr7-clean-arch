import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("organizations", "routes/organizations/index.tsx"),
  route("organizations/new", "routes/organizations/new.tsx"),
  route("organizations/:id/edit", "routes/organizations/edit.tsx"),
  route("organizations/:id/delete", "routes/organizations/delete.tsx"),

  route("departments", "routes/departments/index.tsx"),
  route("departments/new", "routes/departments/new.tsx"),
  route("departments/:id/edit", "routes/departments/edit.tsx"),
  route("departments/:id/delete", "routes/departments/delete.tsx"),
] satisfies RouteConfig;
