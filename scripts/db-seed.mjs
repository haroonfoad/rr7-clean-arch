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

try {
  const result = await pool.query(
    "SELECT id, password FROM users WHERE username = $1",
    [defaultUsername],
  );
  const existing = result.rows[0];

  if (!existing) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    await pool.query(
      "INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",
      ["local-admin", defaultUsername, hashedPassword],
    );
    console.log(`Seeded user '${defaultUsername}' with a hashed password.`);
  } else if (!isBcryptHash(existing.password)) {
    const hashedPassword = await bcrypt.hash(existing.password, 12);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      existing.id,
    ]);
    console.log(
      `Upgraded existing user '${defaultUsername}' password to bcrypt hash.`,
    );
  } else {
    console.log(`User '${defaultUsername}' already exists; skipping seed.`);
  }
} finally {
  await pool.end();
}
