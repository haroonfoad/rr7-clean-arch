import type { ActionFunctionArgs } from "react-router";

import { destroyUserSession } from "~/modules/auth/infrastructure/session/auth-session.server";

export async function action({ request }: ActionFunctionArgs) {
  return destroyUserSession(request);
}
