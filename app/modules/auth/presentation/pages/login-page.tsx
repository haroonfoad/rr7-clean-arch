import {
  Form,
  Link,
  useLoaderData,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import { LanguageSwitcher } from "~/modules/localization/presentation/components/language-switcher";

type ActionData = {
  error?: string;
};

function normalizeRedirectTo(redirectTo: string | null | undefined): string {
  if (
    !redirectTo ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//")
  ) {
    return "/";
  }

  return redirectTo;
}

export function LoginPage() {
  const { t } = useTranslation();
  const loaderData = useLoaderData() as { locale: "en" | "ar" | "ru" } | null;
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const actionData = useActionData() as ActionData | undefined;
  const redirectTo = normalizeRedirectTo(searchParams.get("redirectTo"));
  const locale = loaderData?.locale ?? "en";

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,#f0fdf4_0%,#ecfeff_45%,#eff6ff_100%)] px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-lg backdrop-blur">
        <div className="flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {t("login.badge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {t("login.title")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{t("login.description")}</p>

        <Form method="post" className="mt-6 space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              {t("login.username")}
            </label>
            <InputText
              id="username"
              name="username"
              className="w-full"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              {t("login.password")}
            </label>
            <InputText
              id="password"
              name="password"
              type="password"
              className="w-full"
            />
          </div>

          {actionData?.error ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {actionData.error}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link to={`/${locale}`}>
              <Button type="button" label={t("login.backHome")} text />
            </Link>
            <Button
              type="submit"
              label={t("login.signIn")}
              icon="pi pi-sign-in"
              loading={navigation.state === "submitting"}
            />
          </div>
        </Form>

        <p className="mt-6 text-xs text-slate-500">
          {t("login.demoCredentials")}: <strong>admin</strong> /{" "}
          <strong>admin123</strong>
        </p>
      </section>
    </main>
  );
}
