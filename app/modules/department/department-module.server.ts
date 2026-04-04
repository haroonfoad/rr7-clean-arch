import { CreateDepartmentUseCase } from "./application/use-cases/create-department";
import { DeleteDepartmentUseCase } from "./application/use-cases/delete-department";
import { ListDepartmentsUseCase } from "./application/use-cases/list-departments";
import { UpdateDepartmentUseCase } from "./application/use-cases/update-department";
import { getDepartmentDb } from "./infrastructure/db/client.server";
import { DrizzleDepartmentRepository } from "./infrastructure/repositories/drizzle-department-repository.server";

function buildDepartmentRepository() {
  return new DrizzleDepartmentRepository(getDepartmentDb());
}

export function makeListDepartmentsUseCase(): ListDepartmentsUseCase {
  return new ListDepartmentsUseCase(buildDepartmentRepository());
}

export function makeCreateDepartmentUseCase(): CreateDepartmentUseCase {
  return new CreateDepartmentUseCase(buildDepartmentRepository());
}

export function makeUpdateDepartmentUseCase(): UpdateDepartmentUseCase {
  return new UpdateDepartmentUseCase(buildDepartmentRepository());
}

export function makeDeleteDepartmentUseCase(): DeleteDepartmentUseCase {
  return new DeleteDepartmentUseCase(buildDepartmentRepository());
}
