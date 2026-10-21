import { getCurrentUser } from "./getCurrentUser";
import { UnauthorizedError } from "@infra/errors/errors";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}
