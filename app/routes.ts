import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),

  route("organizations", "routes/organizations/index.tsx", [
    route("new", "routes/organizations/new.tsx"),
    route(":id/edit", "routes/organizations/edit.tsx"),
    route(":id/delete", "routes/organizations/delete.tsx"),
  ]),

  route("departments", "routes/departments/index.tsx", [
    route("new", "routes/departments/new.tsx"),
    route(":id/edit", "routes/departments/edit.tsx"),
    route(":id/delete", "routes/departments/delete.tsx"),
  ]),
] satisfies RouteConfig;
