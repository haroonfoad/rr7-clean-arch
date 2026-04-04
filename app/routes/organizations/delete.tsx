import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import { makeDeleteOrganizationUseCase } from "~/modules/organization/organization-module.server";

type ActionData = {
  error?: string;
};

export async function action({ params }: ActionFunctionArgs) {
  try {
    const id = String(params.id ?? "");

    if (!id) {
      return data<ActionData>(
        { error: "Organization id is required." },
        { status: 400 },
      );
    }

    await makeDeleteOrganizationUseCase().execute(id);
    return redirect("/organizations");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function OrganizationsDeleteRoute() {
  return null;
}
