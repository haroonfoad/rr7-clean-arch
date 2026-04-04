import type { DepartmentRepository } from "../../domain/repositories/department-repository";

export class DeleteDepartmentUseCase {
  constructor(private readonly repository: DepartmentRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("Department id is required.");
    }

    await this.repository.delete(id);
  }
}
