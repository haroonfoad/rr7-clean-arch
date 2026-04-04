import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import { makeDeleteDepartmentUseCase } from "~/modules/department/department-module.server";

type ActionData = {
  error?: string;
};

export async function action({ params }: ActionFunctionArgs) {
  try {
    const id = String(params.id ?? "");

    if (!id) {
      return data<ActionData>(
        { error: "Department id is required." },
        { status: 400 },
      );
    }

    await makeDeleteDepartmentUseCase().execute(id);
    return redirect("/departments");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function DepartmentsDeleteRoute() {
  return null;
}
