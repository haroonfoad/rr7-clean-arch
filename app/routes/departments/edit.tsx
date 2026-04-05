import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";

import { PERMISSIONS } from "~/modules/auth/domain/entities/permission";
import { requirePermission } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeUpdateDepartmentUseCase } from "~/modules/department/department-module.server";
import { makeListDepartmentsUseCase } from "~/modules/department/department-module.server";
import { EditDepartmentDialog } from "~/modules/department/presentation/pages/edit-department-dialog";

type ActionData = {
  error?: string;
};

export async function loader({ request, params }: ActionFunctionArgs) {
  await requirePermission(request, PERMISSIONS.DEPARTMENTS_UPDATE);
  const id = String(params.id ?? "");
  const departments = await makeListDepartmentsUseCase().execute();
  const department = departments.find((item) => item.id === id);

  if (!department) {
    throw data("Department not found", { status: 404 });
  }

  return { department };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requirePermission(request, PERMISSIONS.DEPARTMENTS_UPDATE);

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
    <EditDepartmentDialog
      departmentId={department.id}
      departmentName={department.name}
      submitting={navigation.state === "submitting"}
      error={actionData?.error}
      onCancel={() => navigate("..")}
    />
  );
}
