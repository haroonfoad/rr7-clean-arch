import { useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";

import { DepartmentsPage } from "~/modules/department/presentation/pages/departments-page";
import { makeListDepartmentsUseCase } from "~/modules/department/department-module.server";

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

export async function loader() {
  const departments = await makeListDepartmentsUseCase().execute();
  return { departments };
}

export default function DepartmentsRoute() {
  const { departments } = useLoaderData<typeof loader>();
  return <DepartmentsPage departments={departments} />;
}
