import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";

import { requireAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeUpdateOrganizationUseCase } from "~/modules/organization/organization-module.server";
import { makeListOrganizationsUseCase } from "~/modules/organization/organization-module.server";
import { EditOrganizationDialog } from "~/modules/organization/presentation/pages/edit-organization-dialog";

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
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();

    if (!id || !name) {
      return data<ActionData>(
        { error: "Organization id and name are required." },
        { status: 400 },
      );
    }

    await makeUpdateOrganizationUseCase().execute({ id, name });

    const locale = String(params.locale ?? "en");
    return redirect(withLocalePath(locale, "/organizations"));
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
    <EditOrganizationDialog
      organizationId={organization.id}
      organizationName={organization.name}
      submitting={navigation.state === "submitting"}
      error={actionData?.error}
      onCancel={() => navigate("..")}
    />
  );
}
