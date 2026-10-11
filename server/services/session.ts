import crypto from "node:crypto";

import sessionRepository from "@server/repositories/session";
import { SessionOptions } from "@server/types/session";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 Dias
const RENEW_AFTER_IN_MILLISECONDS = 60 * 60 * 1000; // 1 hora

async function create(userId: string) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSesion = await sessionRepository.runInsertQuery(
    token,
    userId,
    expiresAt,
  );
  return newSesion;
}

async function renewIfNeeded(session: SessionOptions): Promise<SessionOptions> {
  const remaining = session.expires_at.getTime() - Date.now();
  const age = EXPIRATION_IN_MILLISECONDS - remaining;

  if (age < RENEW_AFTER_IN_MILLISECONDS) return session;

  const newExpiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  return await sessionRepository.runUpdateExpiresQuery(
    session.id,
    newExpiresAt,
  );
}

async function findOneValidByToken(token: string) {
  return await sessionRepository.findOneValidByToken(token);
}

const sessionService = {
  create,
  findOneValidByToken,
  renewIfNeeded,
  EXPIRATION_IN_MILLISECONDS,
};

export default sessionService;
