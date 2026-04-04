import { data, redirect } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type { ActionFunctionArgs } from "react-router";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";

import { requireAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeUpdateDepartmentUseCase } from "~/modules/department/department-module.server";
import { makeListDepartmentsUseCase } from "~/modules/department/department-module.server";

type ActionData = {
  error?: string;
};

export async function loader({ request, params }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);
  const id = String(params.id ?? "");
  const departments = await makeListDepartmentsUseCase().execute();
  const department = departments.find((item) => item.id === id);

  if (!department) {
    throw data("Department not found", { status: 404 });
  }

  return { department };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

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

    const locale = String(params.locale ?? "en");
    return redirect(withLocalePath(locale, "/departments"));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function DepartmentsEditRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionData | undefined;
  const { department } = useLoaderData<typeof loader>();

  return (
    <Dialog
      header="Edit Department"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={() => navigate("..")}
    >
      <Form method="post" className="space-y-4">
        <input type="hidden" name="id" value={department.id} />

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Department Name
          </label>
          <InputText
            id="name"
            name="name"
            className="w-full"
            defaultValue={department.name}
            autoFocus
          />
        </div>

        {actionData?.error ? (
          <p className="text-sm text-red-700">{actionData.error}</p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            text
            onClick={() => navigate("..")}
          />
          <Button
            type="submit"
            label="Save"
            loading={navigation.state === "submitting"}
          />
        </div>
      </Form>
    </Dialog>
  );
}
