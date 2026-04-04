import type { OrganizationRepository } from "../../domain/repositories/organization-repository";

interface CreateOrganizationInput {
  id: string;
  name: string;
}

export class CreateOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(input: CreateOrganizationInput): Promise<void> {
    const name = input.name.trim();

    if (!name) {
      throw new Error("Organization name is required.");
    }

    const nameExists = await this.repository.existsByName(name);
    if (nameExists) {
      throw new Error("Organization name already exists.");
    }

    await this.repository.create({
      id: input.id,
      name,
    });
  }
}
