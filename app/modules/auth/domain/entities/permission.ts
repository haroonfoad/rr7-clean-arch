export const PERMISSIONS = {
  ORGANIZATIONS_LIST: "organizations.list",
  ORGANIZATIONS_CREATE: "organizations.create",
  ORGANIZATIONS_UPDATE: "organizations.update",
  ORGANIZATIONS_DELETE: "organizations.delete",
  DEPARTMENTS_LIST: "departments.list",
  DEPARTMENTS_CREATE: "departments.create",
  DEPARTMENTS_UPDATE: "departments.update",
  DEPARTMENTS_DELETE: "departments.delete",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
