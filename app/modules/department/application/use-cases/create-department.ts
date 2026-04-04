import type { DepartmentRepository } from "../../domain/repositories/department-repository";

interface CreateDepartmentInput {
  id: string;
  name: string;
}

export class CreateDepartmentUseCase {
  constructor(private readonly repository: DepartmentRepository) {}

  async execute(input: CreateDepartmentInput): Promise<void> {
    const name = input.name.trim();

    if (!name) {
      throw new Error("Department name is required.");
    }

    const nameExists = await this.repository.existsByName(name);
    if (nameExists) {
      throw new Error("Department name already exists.");
    }

    await this.repository.create({
      id: input.id,
      name,
    });
  }
}
