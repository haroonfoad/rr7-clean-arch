import { data, redirect } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import type { ActionFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigate, useNavigation } from "react-router";

import { requireAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeDeleteOrganizationUseCase } from "~/modules/organization/organization-module.server";
import { makeListOrganizationsUseCase } from "~/modules/organization/organization-module.server";

type ActionData = {
  error?: string;
};

export async function loader({ request, params }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);
  const id = String(params.id ?? "");
  const organizations = await makeListOrganizationsUseCase().execute();
  const organization = organizations.find((item) => item.id === id);

  if (!organization) {
    throw data("Organization not found", { status: 404 });
  }

  return { organization };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  try {
    const id = String(params.id ?? "");

    if (!id) {
      return data<ActionData>(
        { error: "Organization id is required." },
        { status: 400 },
      );
    }

    await makeDeleteOrganizationUseCase().execute(id);
    const locale = String(params.locale ?? "en");
    return redirect(withLocalePath(locale, "/organizations"));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function OrganizationsDeleteRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { organization } = useLoaderData<typeof loader>();

  return (
    <Dialog
      header="Delete Organization"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={() => navigate("..")}
    >
      <Form method="post" className="space-y-4">
        <p className="text-sm text-slate-700">
          Are you sure you want to delete <strong>{organization.name}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            text
            onClick={() => navigate("..")}
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
