import { cookies } from "next/headers";
import sessionService from "@server/services/session";
import userService from "@server/services/users";

export async function getCurrentUser() {
  const token = (await cookies()).get("session_id")?.value;
  if (!token) return null;

  const session = await sessionService.findOneValidByToken(token);
  if (!session) return null;

  const { senha, ...user } = await userService.findOneById(session.user_id);
  return user;
}
