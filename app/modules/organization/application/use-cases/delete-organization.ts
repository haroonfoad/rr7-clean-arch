import type { OrganizationRepository } from "../../domain/repositories/organization-repository";

export class DeleteOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("Organization id is required.");
    }

    await this.repository.delete(id);
  }
}
