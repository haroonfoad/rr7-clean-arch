import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import { makeUpdateDepartmentUseCase } from "~/modules/department/department-module.server";

type ActionData = {
  error?: string;
};

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const id = String(params.id ?? "");
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();

    if (!id || !name) {
      return data<ActionData>(
        { error: "Department id and name are required." },
        { status: 400 },
      );
    }

    await makeUpdateDepartmentUseCase().execute({ id, name });

    return redirect("/departments");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function DepartmentsEditRoute() {
  return null;
}
