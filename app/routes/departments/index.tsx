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
  await requirePermission(request, PERMISSIONS.DEPARTMENTS_LIST);
  const departments = await makeListDepartmentsUseCase().execute();
  return { departments };
}

export default function DepartmentsRoute() {
  const { departments } = useLoaderData<typeof loader>();
  return (
    <>
      <DepartmentsPage departments={departments} />
      <Outlet />
    </>
  );
}
