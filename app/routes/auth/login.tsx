import { data, redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { makeAuthenticateUserUseCase } from "~/modules/auth/auth-module.server";
import {
  createUserSession,
  getAuthenticatedUser,
} from "~/modules/auth/infrastructure/session/auth-session.server";
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
  const user = await getAuthenticatedUser(request);

  if (user) {
    const url = new URL(request.url);
    const redirectTo = normalizeRedirectTo(url.searchParams.get("redirectTo"));
    throw redirect(redirectTo === "/login" ? "/" : redirectTo);
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = normalizeRedirectTo(
    String(formData.get("redirectTo") ?? "/"),
  );

  if (!username || !password) {
    return data<ActionData>(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const user = await makeAuthenticateUserUseCase().execute({
    username,
    password,
  });

  if (!user) {
    return data<ActionData>(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  return createUserSession({
    request,
    user: { id: user.id, username: user.username },
    redirectTo,
  });
}

export default function LoginRoute() {
  return <LoginPage />;
}
