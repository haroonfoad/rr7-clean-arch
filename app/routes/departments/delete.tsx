import { data, redirect } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import type { ActionFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigate, useNavigation } from "react-router";

import { makeDeleteDepartmentUseCase } from "~/modules/department/department-module.server";
import { makeListDepartmentsUseCase } from "~/modules/department/department-module.server";

type ActionData = {
  error?: string;
};

export async function loader({ params }: ActionFunctionArgs) {
  const id = String(params.id ?? "");
  const departments = await makeListDepartmentsUseCase().execute();
  const department = departments.find((item) => item.id === id);

  if (!department) {
    throw data("Department not found", { status: 404 });
  }

  return { department };
}

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
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { department } = useLoaderData<typeof loader>();

  return (
    <Dialog
      header="Delete Department"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={() => navigate("/departments")}
    >
      <Form method="post" className="space-y-4">
        <p className="text-sm text-slate-700">
          Are you sure you want to delete <strong>{department.name}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            text
            onClick={() => navigate("/departments")}
          />
          <Button
            type="submit"
            label="Delete"
            severity="danger"
            loading={navigation.state === "submitting"}
          />
        </div>
      </Form>
    </Dialog>
  );
}
