import { Outlet, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

import {
  DEFAULT_LOCALE,
  isSupportedLocale,
} from "~/modules/localization/domain/entities/locale";
import {
  detectLocale,
  localeCookie,
  withLocalePath,
} from "~/modules/localization/infrastructure/i18n/server-locale.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const localeParam = String(params.locale ?? "").toLowerCase();

  if (isSupportedLocale(localeParam)) {
    const cookieHeader = request.headers.get("Cookie");
    const cookieLocale = await localeCookie.parse(cookieHeader);

    if (cookieLocale !== localeParam) {
      return Response.json(
        { locale: localeParam },
        {
          headers: {
            "Set-Cookie": await localeCookie.serialize(localeParam),
          },
        },
      );
    }

    return { locale: localeParam };
  }

  const locale = await detectLocale(request);
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const restPath =
    segments.length > 1 ? `/${segments.slice(1).join("/")}` : "/";

  throw redirect(
    withLocalePath(locale ?? DEFAULT_LOCALE, restPath) + url.search,
  );
}

export default function LocaleLayoutRoute() {
  return <Outlet />;
}
