import type { OrganizationRepository } from "../../domain/repositories/organization-repository";

interface UpdateOrganizationInput {
  id: string;
  name: string;
}

export class UpdateOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(input: UpdateOrganizationInput): Promise<void> {
    const name = input.name.trim();

    if (!input.id) {
      throw new Error("Organization id is required.");
    }

    if (!name) {
      throw new Error("Organization name is required.");
    }

    const nameExists = await this.repository.existsByName(name, input.id);
    if (nameExists) {
      throw new Error("Organization name already exists.");
    }

    await this.repository.update({
      id: input.id,
      name,
    });
  }
}
