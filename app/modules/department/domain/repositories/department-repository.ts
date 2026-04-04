import type { Department } from "../entities/department";

export interface DepartmentRepository {
  list(): Promise<Department[]>;
  existsByName(name: string, excludeId?: string): Promise<boolean>;
  create(department: Department): Promise<void>;
  update(department: Department): Promise<void>;
  delete(id: string): Promise<void>;
}
