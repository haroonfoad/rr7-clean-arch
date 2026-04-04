import { createCookie } from "react-router";

import {
  DEFAULT_LOCALE,
  type AppLocale,
  isSupportedLocale,
} from "../../domain/entities/locale";

const LOCALE_QUERY_PARAM = "lng";

export const localeCookie = createCookie("locale", {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 365,
  httpOnly: false,
});

function normalizeLocale(value: string | null | undefined): AppLocale | null {
  if (!value) {
    return null;
  }

  const direct = value.trim().toLowerCase();
  if (isSupportedLocale(direct)) {
    return direct;
  }

  const [base] = direct.split("-");
  return base && isSupportedLocale(base) ? base : null;
}

export function localeFromPathname(pathname: string): AppLocale | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  return normalizeLocale(firstSegment);
}

function localeFromAcceptLanguage(request: Request): AppLocale | null {
  const header = request.headers.get("Accept-Language");
  if (!header) {
    return null;
  }

  const candidates = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) {
      return locale;
    }
  }

  return null;
}

export async function detectLocale(request: Request): Promise<AppLocale> {
  const url = new URL(request.url);
  const pathLocale = localeFromPathname(url.pathname);
  if (pathLocale) {
    return pathLocale;
  }

  const queryLocale = normalizeLocale(url.searchParams.get(LOCALE_QUERY_PARAM));
  if (queryLocale) {
    return queryLocale;
  }

  const cookieHeader = request.headers.get("Cookie");
  const cookieLocale = normalizeLocale(await localeCookie.parse(cookieHeader));
  if (cookieLocale) {
    return cookieLocale;
  }

  return localeFromAcceptLanguage(request) ?? DEFAULT_LOCALE;
}

export function localeFromRequestPath(request: Request): AppLocale {
  const url = new URL(request.url);
  return localeFromPathname(url.pathname) ?? DEFAULT_LOCALE;
}

export function withLocalePath(locale: string, path: string): string {
  const safeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const safePath = path.startsWith("/") ? path : `/${path}`;
  if (safePath === "/") {
    return `/${safeLocale}`;
  }

  return `/${safeLocale}${safePath}`;
}

export function normalizeRedirectTo(
  redirectTo: string | null | undefined,
): string {
  if (
    !redirectTo ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//")
  ) {
    return "/";
  }

  return redirectTo;
}
