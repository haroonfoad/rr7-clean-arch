import type { AuthUser } from "../../domain/entities/auth-user";
import type {
  AuthRepository,
  Credentials,
} from "../../domain/repositories/auth-repository";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

export class EnvAuthRepository implements AuthRepository {
  async verifyCredentials(credentials: Credentials): Promise<AuthUser | null> {
    const username = process.env.AUTH_USERNAME ?? DEFAULT_USERNAME;
    const password = process.env.AUTH_PASSWORD ?? DEFAULT_PASSWORD;

    const isMatch =
      credentials.username === username && credentials.password === password;

    if (!isMatch) {
      return null;
    }

    return {
      id: "local-admin",
      username,
    };
  }
}
