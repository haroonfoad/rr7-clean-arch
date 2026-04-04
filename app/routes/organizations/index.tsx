import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { OrganizationsPage } from "~/modules/organization/presentation/pages/organizations-page";
import { makeListOrganizationsUseCase } from "~/modules/organization/organization-module.server";
import { requireAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";

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

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthenticatedUser(request);
  const organizations = await makeListOrganizationsUseCase().execute();
  return { organizations };
}

export default function OrganizationsRoute() {
  const { organizations } = useLoaderData<typeof loader>();
  return (
    <>
      <OrganizationsPage organizations={organizations} />
      <Outlet />
    </>
  );
}
