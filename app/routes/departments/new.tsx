import { data, redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useActionData, useNavigate, useNavigation } from "react-router";

import { PERMISSIONS } from "~/modules/auth/domain/entities/permission";
import { requirePermission } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeCreateDepartmentUseCase } from "~/modules/department/department-module.server";
import { NewDepartmentDialog } from "~/modules/department/presentation/pages/new-department-dialog";

type ActionData = {
  error?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermission(request, PERMISSIONS.DEPARTMENTS_CREATE);
  return null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requirePermission(request, PERMISSIONS.DEPARTMENTS_CREATE);

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

    const locale = String(params.locale ?? "en");
    return redirect(withLocalePath(locale, "/departments"));
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
    <NewDepartmentDialog
      submitting={navigation.state === "submitting"}
      error={actionData?.error}
      onCancel={() => navigate("..")}
    />
  );
}
