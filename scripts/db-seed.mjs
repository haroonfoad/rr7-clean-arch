import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

function isBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

const sqlite = new Database("organization.db");

const defaultUsername = process.env.AUTH_USERNAME ?? "admin";
const defaultPassword = process.env.AUTH_PASSWORD ?? "admin123";

const existing = sqlite
  .prepare("SELECT id, password FROM users WHERE username = ?")
  .get(defaultUsername);

if (!existing) {
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);
  sqlite
    .prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)")
    .run("local-admin", defaultUsername, hashedPassword);
  console.log(`Seeded user '${defaultUsername}' with a hashed password.`);
} else if (!isBcryptHash(existing.password)) {
  const hashedPassword = await bcrypt.hash(existing.password, 12);
  sqlite
    .prepare("UPDATE users SET password = ? WHERE id = ?")
    .run(hashedPassword, existing.id);
  console.log(
    `Upgraded existing user '${defaultUsername}' password to bcrypt hash.`,
  );
} else {
  console.log(`User '${defaultUsername}' already exists; skipping seed.`);
}

sqlite.close();
