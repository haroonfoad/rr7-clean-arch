import { data, redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { makeAuthenticateUserUseCase } from "~/modules/auth/auth-module.server";
import {
  createUserSession,
  getAuthenticatedUser,
} from "~/modules/auth/infrastructure/session/auth-session.server";
import { createI18nInstance } from "~/modules/localization/infrastructure/i18n/i18n-instance";
import {
  detectLocale,
  withLocalePath,
} from "~/modules/localization/infrastructure/i18n/server-locale.server";
import { LoginPage } from "~/modules/auth/presentation/pages/login-page";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await detectLocale(request);
  const user = await getAuthenticatedUser(request);

  if (user) {
    const url = new URL(request.url);
    const redirectTo = normalizeRedirectTo(url.searchParams.get("redirectTo"));
    throw redirect(
      redirectTo === withLocalePath(locale, "/login")
        ? withLocalePath(locale, "/")
        : redirectTo,
    );
  }

  return { locale };
}

export async function action({ request }: ActionFunctionArgs) {
  const locale = await detectLocale(request);
  const i18n = await createI18nInstance(locale);

  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = normalizeRedirectTo(
    String(formData.get("redirectTo") ?? withLocalePath(locale, "/")),
  );

  if (!username || !password) {
    return data<ActionData>(
      { error: i18n.t("auth.missingCredentials") },
      { status: 400 },
    );
  }

  const user = await makeAuthenticateUserUseCase().execute({
    username,
    password,
  });

  if (!user) {
    return data<ActionData>(
      { error: i18n.t("auth.invalidCredentials") },
      { status: 401 },
    );
  }

  return createUserSession({
    request,
    user: {
      id: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions,
    },
    redirectTo,
  });
}

export default function LoginRoute() {
  return <LoginPage />;
}
