import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import type { AuthUser } from "../../domain/entities/auth-user";
import type {
  AuthRepository,
  Credentials,
} from "../../domain/repositories/auth-repository";
import { getAuthDb } from "../db/client.server";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from "../db/schema";

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

export class DrizzleAuthRepository implements AuthRepository {
  async verifyCredentials(credentials: Credentials): Promise<AuthUser | null> {
    const db = getAuthDb();

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
      })
      .from(users)
      .where(eq(users.username, credentials.username))
      .limit(1);

    if (!user) {
      return null;
    }

    if (isBcryptHash(user.password)) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      return isValid
        ? this.buildAuthUserWithRbac(user.id, user.username)
        : null;
    }

    // Backward compatibility: accept legacy plaintext once, then upgrade it to bcrypt.
    if (credentials.password !== user.password) {
      return null;
    }

    const upgradedHash = await bcrypt.hash(credentials.password, 12);
    await db
      .update(users)
      .set({ password: upgradedHash })
      .where(eq(users.id, user.id));

    return this.buildAuthUserWithRbac(user.id, user.username);
  }

  private async buildAuthUserWithRbac(
    userId: string,
    username: string,
  ): Promise<AuthUser> {
    const db = getAuthDb();

    const roleRows = await db
      .select({ name: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    const permissionRows = await db
      .select({ key: permissions.key })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    return {
      id: userId,
      username,
      roles: [...new Set(roleRows.map((row) => row.name))],
      permissions: [...new Set(permissionRows.map((row) => row.key))],
    };
  }
}
