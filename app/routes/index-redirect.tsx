import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

import {
  detectLocale,
  withLocalePath,
} from "~/modules/localization/infrastructure/i18n/server-locale.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await detectLocale(request);
  throw redirect(withLocalePath(locale, "/"));
}
