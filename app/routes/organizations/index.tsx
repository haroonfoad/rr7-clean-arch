import { useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";

import { OrganizationsPage } from "~/modules/organization/presentation/pages/organizations-page";
import { makeListOrganizationsUseCase } from "~/modules/organization/organization-module.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Organizations | Clean Architecture" },
    {
      name: "description",
      content:
        "Simple CRUD example using clean architecture with RR7, PrimeReact, and Drizzle ORM.",
    },
  ];
};

export async function loader() {
  const organizations = await makeListOrganizationsUseCase().execute();
  return { organizations };
}

export default function OrganizationsRoute() {
  const { organizations } = useLoaderData<typeof loader>();
  return <OrganizationsPage organizations={organizations} />;
}
