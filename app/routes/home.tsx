import type { Route } from "./+types/home";
import { Form, Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";

import { getAuthenticatedUser } from "~/modules/auth/infrastructure/session/auth-session.server";
import { detectLocale } from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { LanguageSwitcher } from "~/modules/localization/presentation/components/language-switcher";

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
  const locale = await detectLocale(request);
  const user = await getAuthenticatedUser(request);
  return { user, locale };
}

export default function Home() {
  const { t } = useTranslation();
  const { user, locale } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,#ecfeff_0%,#eff6ff_45%,#fefce8_100%)] px-4 py-16">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-lg backdrop-blur">
        <div className="flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {t("home.badge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {t("home.title")}
        </h1>
        <p className="mt-3 text-slate-600">{t("home.description")}</p>

        <p className="mt-2 text-sm text-slate-600">
          {user
            ? t("home.signedInAs", { username: user.username })
            : t("home.signInPrompt")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <>
              <Link to="organizations">
                <Button
                  label={t("home.openOrganizations")}
                  icon="pi pi-building"
                />
              </Link>
              <Link to="departments">
                <Button
                  label={t("home.openDepartments")}
                  icon="pi pi-sitemap"
                  outlined
                />
              </Link>
              <Form method="post" action="logout">
                <Button label={t("common.logout")} icon="pi pi-sign-out" text />
              </Form>
            </>
          ) : (
            <Link to="login">
              <Button label={t("home.openLogin")} icon="pi pi-sign-in" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
