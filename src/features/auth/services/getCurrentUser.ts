import { cache } from "react";
import { cookies } from "next/headers";

import sessionService from "@server/services/session";
import userService from "@server/services/users";

export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get("session_id")?.value;
  if (!token) return null;

  const session = await sessionService.findOneValidByToken(token);
  if (!session) return null;

  await sessionService.renewIfNeeded(session);

  const { senha, ...user } = await userService.findOneById(session.user_id);
  return user;
});
