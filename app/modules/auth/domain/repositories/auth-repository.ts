import type { AuthUser } from "../entities/auth-user";

export type Credentials = {
  username: string;
  password: string;
};

export interface AuthRepository {
  verifyCredentials(credentials: Credentials): Promise<AuthUser | null>;
}
