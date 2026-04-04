import { AuthenticateUserUseCase } from "./application/use-cases/authenticate-user";
import { EnvAuthRepository } from "./infrastructure/repositories/env-auth-repository.server";

function buildAuthRepository() {
  return new EnvAuthRepository();
}

export function makeAuthenticateUserUseCase(): AuthenticateUserUseCase {
  return new AuthenticateUserUseCase(buildAuthRepository());
}
