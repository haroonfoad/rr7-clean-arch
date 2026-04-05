import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { DepartmentsPage } from "~/modules/department/presentation/pages/departments-page";
import { makeListDepartmentsUseCase } from "~/modules/department/department-module.server";
import { PERMISSIONS } from "~/modules/auth/domain/entities/permission";
import { requirePermission } from "~/modules/auth/infrastructure/session/auth-session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Departments | Clean Architecture" },
    {
      name: "description",
      content:
        "Second CRUD module cloned from organization clean architecture pattern.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requirePermission(request, PERMISSIONS.DEPARTMENTS_LIST);
  const departments = await makeListDepartmentsUseCase().execute();
  const canCreate = user.permissions.includes(PERMISSIONS.DEPARTMENTS_CREATE);
  const canUpdate = user.permissions.includes(PERMISSIONS.DEPARTMENTS_UPDATE);
  const canDelete = user.permissions.includes(PERMISSIONS.DEPARTMENTS_DELETE);
  return { departments, canCreate, canUpdate, canDelete };
}

export default function DepartmentsRoute() {
  const { departments, canCreate, canUpdate, canDelete } =
    useLoaderData<typeof loader>();
  return (
    <>
      <DepartmentsPage
        departments={departments}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
      <Outlet />
    </>
  );
}
