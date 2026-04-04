import { data, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import { makeCreateOrganizationUseCase } from "~/modules/organization/organization-module.server";

type ActionData = {
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
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

    return redirect("/organizations");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected action error.";
    return data<ActionData>({ error: message }, { status: 400 });
  }
}

export default function OrganizationsNewRoute() {
  return null;
}
