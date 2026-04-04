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

import { makeUpdateOrganizationUseCase } from "~/modules/organization/organization-module.server";
import { makeListOrganizationsUseCase } from "~/modules/organization/organization-module.server";

type ActionData = {
  error?: string;
};

export async function loader({ params }: ActionFunctionArgs) {
  const id = String(params.id ?? "");
  const organizations = await makeListOrganizationsUseCase().execute();
  const organization = organizations.find((item) => item.id === id);

  if (!organization) {
    throw data("Organization not found", { status: 404 });
  }

  return { organization };
}

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const id = String(params.id ?? "");
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();

    if (!id || !name) {
      return data<ActionData>(
        { error: "Organization id and name are required." },
        { status: 400 },
      );
    }

    await makeUpdateOrganizationUseCase().execute({ id, name });

    return redirect("/organizations");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function OrganizationsEditRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionData | undefined;
  const { organization } = useLoaderData<typeof loader>();

  return (
    <Dialog
      header="Edit Organization"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={() => navigate("/organizations")}
    >
      <Form method="post" className="space-y-4">
        <input type="hidden" name="id" value={organization.id} />

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Organization Name
          </label>
          <InputText
            id="name"
            name="name"
            className="w-full"
            defaultValue={organization.name}
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
            onClick={() => navigate("/organizations")}
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
