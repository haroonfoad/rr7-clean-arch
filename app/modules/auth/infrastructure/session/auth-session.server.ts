import { createCookieSessionStorage, redirect } from "react-router";

import type { AuthUser } from "../../domain/entities/auth-user";

type SessionUser = Pick<AuthUser, "id" | "username">;

type CreateUserSessionInput = {
  request: Request;
  user: SessionUser;
  redirectTo: string;
};

const USER_SESSION_KEY = "user";
const DEFAULT_SESSION_SECRET = "dev-only-secret-change-me";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? DEFAULT_SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

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

function buildCurrentPath(request: Request): string {
  const url = new URL(request.url);
  return `${url.pathname}${url.search}`;
}

export async function getAuthenticatedUser(
  request: Request,
): Promise<SessionUser | null> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const sessionUser = session.get(USER_SESSION_KEY) as SessionUser | undefined;
  return sessionUser ?? null;
}

export async function requireAuthenticatedUser(
  request: Request,
): Promise<SessionUser> {
  const user = await getAuthenticatedUser(request);

  if (user) {
    return user;
  }

  const redirectTo = encodeURIComponent(buildCurrentPath(request));
  throw redirect(`/login?redirectTo=${redirectTo}`);
}

export async function createUserSession({
  request,
  user,
  redirectTo,
}: CreateUserSessionInput) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  session.set(USER_SESSION_KEY, user);

  return redirect(normalizeRedirectTo(redirectTo), {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
