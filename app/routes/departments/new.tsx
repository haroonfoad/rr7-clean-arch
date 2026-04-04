import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import { makeCreateDepartmentUseCase } from "~/modules/department/department-module.server";

type ActionData = {
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      return data<ActionData>(
        { error: "Department name is required." },
        { status: 400 },
      );
    }

    await makeCreateDepartmentUseCase().execute({
      id: crypto.randomUUID(),
      name,
    });

    return redirect("/departments");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function DepartmentsNewRoute() {
  return null;
}
