import type { AuthUser } from "../../domain/entities/auth-user";
import type {
  AuthRepository,
  Credentials,
} from "../../domain/repositories/auth-repository";

export class AuthenticateUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(credentials: Credentials): Promise<AuthUser | null> {
    return this.authRepository.verifyCredentials(credentials);
  }
}
