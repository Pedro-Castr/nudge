import crypto from "node:crypto";
import sessionRepository from "@server/repositories/session";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 60 * 1000; // 60 Dias

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

async function findOneValidByToken(token: string) {
  return await sessionRepository.findOneValidByToken(token);
}

const sessionService = {
  create,
  findOneValidByToken,
  EXPIRATION_IN_MILLISECONDS,
};

export default sessionService;
