import { data, redirect } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type { ActionFunctionArgs } from "react-router";
import { Form, useActionData, useNavigate, useNavigation } from "react-router";

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
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionData | undefined;

  return (
    <Dialog
      header="Add Department"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={() => navigate("/departments")}
    >
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Department Name
          </label>
          <InputText id="name" name="name" className="w-full" autoFocus />
        </div>

        {actionData?.error ? (
          <p className="text-sm text-red-700">{actionData.error}</p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            text
            onClick={() => navigate("/departments")}
          />
          <Button
            type="submit"
            label="Create"
            loading={navigation.state === "submitting"}
          />
        </div>
      </Form>
    </Dialog>
  );
}
