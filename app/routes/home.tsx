import type { Route } from "./+types/home";
import { Form, Link, useLoaderData } from "react-router";
import { Button } from "primereact/button";

import { getAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clean Architecture Demo" },
    {
      name: "description",
      content: "Module index for clean architecture examples.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getAuthenticatedUser(request);
  return { user };
}

export default function Home() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,#ecfeff_0%,#eff6ff_45%,#fefce8_100%)] px-4 py-16">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-lg backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          RR7 Template
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Clean Architecture Modules
        </h1>
        <p className="mt-3 text-slate-600">
          Start with the Organization module, then replicate the same structure
          for the rest of your system.
        </p>

        <p className="mt-2 text-sm text-slate-600">
          {user
            ? `Signed in as ${user.username}.`
            : "Sign in first to access module routes."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <>
              <Link to="/organizations">
                <Button label="Open Organization CRUD" icon="pi pi-building" />
              </Link>
              <Link to="/departments">
                <Button
                  label="Open Department CRUD"
                  icon="pi pi-sitemap"
                  outlined
                />
              </Link>
              <Form method="post" action="/logout">
                <Button label="Logout" icon="pi pi-sign-out" text />
              </Form>
            </>
          ) : (
            <Link to="/login">
              <Button label="Open Login" icon="pi pi-sign-in" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
