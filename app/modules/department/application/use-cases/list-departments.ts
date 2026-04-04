import type { Department } from "../../domain/entities/department";
import type { DepartmentRepository } from "../../domain/repositories/department-repository";

export class ListDepartmentsUseCase {
  constructor(private readonly repository: DepartmentRepository) {}

  execute(): Promise<Department[]> {
    return this.repository.list();
  }
}
