import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

function isBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run db seed.");
}

const pool = new Pool({ connectionString: databaseUrl });

const defaultUsername = process.env.AUTH_USERNAME ?? "admin";
const defaultPassword = process.env.AUTH_PASSWORD ?? "admin123";
const viewerUsername = process.env.AUTH_VIEWER_USERNAME ?? "viewer";
const viewerPassword = process.env.AUTH_VIEWER_PASSWORD ?? "viewer123";

const roles = {
  admin: { id: "role-admin", name: "admin" },
  dataViewer: { id: "role-data-viewer", name: "data_viewer" },
};

const permissionKeys = [
  "organizations.list",
  "organizations.create",
  "organizations.update",
  "organizations.delete",
  "departments.list",
  "departments.create",
  "departments.update",
  "departments.delete",
];

function permissionIdFromKey(key) {
  return `perm-${key.replace(/\./g, "-")}`;
}

async function ensureUser(username, password, id) {
  const result = await pool.query(
    "SELECT id, password FROM users WHERE username = $1",
    [username],
  );
  const existing = result.rows[0];

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(
      "INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",
      [id, username, hashedPassword],
    );
    console.log(`Seeded user '${username}' with a hashed password.`);
    return id;
  }

  if (!isBcryptHash(existing.password)) {
    const hashedPassword = await bcrypt.hash(existing.password, 12);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      existing.id,
    ]);
    console.log(
      `Upgraded existing user '${username}' password to bcrypt hash.`,
    );
  } else {
    console.log(`User '${username}' already exists; skipping seed.`);
  }

  return existing.id;
}

async function seedRbac() {
  await pool.query(
    "INSERT INTO roles (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name",
    [roles.admin.id, roles.admin.name],
  );
  await pool.query(
    "INSERT INTO roles (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name",
    [roles.dataViewer.id, roles.dataViewer.name],
  );

  for (const key of permissionKeys) {
    const permissionId = permissionIdFromKey(key);
    await pool.query(
      "INSERT INTO permissions (id, key) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET key = EXCLUDED.key",
      [permissionId, key],
    );
  }

  for (const key of permissionKeys) {
    await pool.query(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [roles.admin.id, permissionIdFromKey(key)],
    );
  }

  const viewerKeys = ["organizations.list", "departments.list"];
  for (const key of viewerKeys) {
    await pool.query(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [roles.dataViewer.id, permissionIdFromKey(key)],
    );
  }

  console.log("Seeded RBAC roles and permissions.");
}

async function assignRoleToUser(userId, roleId) {
  await pool.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [userId, roleId],
  );
}

try {
  await seedRbac();

  const adminUserId = await ensureUser(
    defaultUsername,
    defaultPassword,
    "local-admin",
  );
  await assignRoleToUser(adminUserId, roles.admin.id);

  const viewerUserId = await ensureUser(
    viewerUsername,
    viewerPassword,
    "local-viewer",
  );
  await assignRoleToUser(viewerUserId, roles.dataViewer.id);
} finally {
  await pool.end();
}
