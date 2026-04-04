import { and, eq } from "drizzle-orm";

import type { AuthUser } from "../../domain/entities/auth-user";
import type {
  AuthRepository,
  Credentials,
} from "../../domain/repositories/auth-repository";
import { getAuthDb } from "../db/client.server";
import { users } from "../db/schema";

export class DrizzleAuthRepository implements AuthRepository {
  async verifyCredentials(credentials: Credentials): Promise<AuthUser | null> {
    const db = getAuthDb();

    const [user] = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(
        and(
          eq(users.username, credentials.username),
          eq(users.password, credentials.password),
        ),
      )
      .limit(1);

    return user ?? null;
  }
}
