import { CreateOrganizationUseCase } from "./application/use-cases/create-organization";
import { DeleteOrganizationUseCase } from "./application/use-cases/delete-organization";
import { ListOrganizationsUseCase } from "./application/use-cases/list-organizations";
import { UpdateOrganizationUseCase } from "./application/use-cases/update-organization";
import { getOrganizationDb } from "./infrastructure/db/client.server";
import { DrizzleOrganizationRepository } from "./infrastructure/repositories/drizzle-organization-repository.server";

function buildOrganizationRepository() {
  return new DrizzleOrganizationRepository(getOrganizationDb());
}

export function makeListOrganizationsUseCase(): ListOrganizationsUseCase {
  return new ListOrganizationsUseCase(buildOrganizationRepository());
}

export function makeCreateOrganizationUseCase(): CreateOrganizationUseCase {
  return new CreateOrganizationUseCase(buildOrganizationRepository());
}

export function makeUpdateOrganizationUseCase(): UpdateOrganizationUseCase {
  return new UpdateOrganizationUseCase(buildOrganizationRepository());
}

export function makeDeleteOrganizationUseCase(): DeleteOrganizationUseCase {
  return new DeleteOrganizationUseCase(buildOrganizationRepository());
}
