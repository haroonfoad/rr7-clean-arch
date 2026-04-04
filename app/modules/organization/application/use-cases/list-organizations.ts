import type { Organization } from "../../domain/entities/organization";
import type { OrganizationRepository } from "../../domain/repositories/organization-repository";

export class ListOrganizationsUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  execute(): Promise<Organization[]> {
    return this.repository.list();
  }
}
