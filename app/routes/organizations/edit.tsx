import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import { makeUpdateOrganizationUseCase } from "~/modules/organization/organization-module.server";

type ActionData = {
  error?: string;
};

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
  return null;
}
