import type { DepartmentRepository } from "../../domain/repositories/department-repository";

interface UpdateDepartmentInput {
  id: string;
  name: string;
}

export class UpdateDepartmentUseCase {
  constructor(private readonly repository: DepartmentRepository) {}

  async execute(input: UpdateDepartmentInput): Promise<void> {
    const name = input.name.trim();

    if (!input.id) {
      throw new Error("Department id is required.");
    }

    if (!name) {
      throw new Error("Department name is required.");
    }

    const nameExists = await this.repository.existsByName(name, input.id);
    if (nameExists) {
      throw new Error("Department name already exists.");
    }

    await this.repository.update({
      id: input.id,
      name,
    });
  }
}
