import { AuthenticateUserUseCase } from "./application/use-cases/authenticate-user";
import { DrizzleAuthRepository } from "./infrastructure/repositories/drizzle-auth-repository.server";

function buildAuthRepository() {
  return new DrizzleAuthRepository();
}

export function makeAuthenticateUserUseCase(): AuthenticateUserUseCase {
  return new AuthenticateUserUseCase(buildAuthRepository());
}
