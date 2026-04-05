import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useNavigation } from "react-router";

import { requireAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";
import { withLocalePath } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { makeDeleteDepartmentUseCase } from "~/modules/department/department-module.server";
import { makeListDepartmentsUseCase } from "~/modules/department/department-module.server";
import { DeleteDepartmentDialog } from "~/modules/department/presentation/pages/delete-department-dialog";

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

    if (!id) {
      return data<ActionData>(
        { error: "Department id is required." },
        { status: 400 },
      );
    }

    await makeDeleteDepartmentUseCase().execute(id);
    const locale = String(params.locale ?? "en");
    return redirect(withLocalePath(locale, "/departments"));
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
    <DeleteDepartmentDialog
      departmentName={department.name}
      submitting={navigation.state === "submitting"}
      onCancel={() => navigate("..")}
    />
  );
}
