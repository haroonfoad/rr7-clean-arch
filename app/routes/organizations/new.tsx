import { data, redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useActionData, useNavigate, useNavigation } from "react-router";

import { requireAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeCreateOrganizationUseCase } from "~/modules/organization/organization-module.server";
import { NewOrganizationDialog } from "~/modules/organization/presentation/pages/new-organization-dialog";

type ActionData = {
  error?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthenticatedUser(request);
  return null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      return data<ActionData>(
        { error: "Organization name is required." },
        { status: 400 },
      );
    }

    await makeCreateOrganizationUseCase().execute({
      id: crypto.randomUUID(),
      name,
    });

    const locale = String(params.locale ?? "en");
    return redirect(withLocalePath(locale, "/organizations"));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function OrganizationsNewRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionData | undefined;

  return (
    <NewOrganizationDialog
      submitting={navigation.state === "submitting"}
      error={actionData?.error}
      onCancel={() => navigate("..")}
    />
  );
}
