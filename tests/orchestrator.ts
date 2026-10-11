import { faker } from "@faker-js/faker";
import database from "@infra/connection";
import migrator from "@infra/migrator";
import user from "@server/services/users";

type CreateUserOptions = {
  nome?: string;
  email?: string;
  senha?: string;
};

async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject: CreateUserOptions) {
  return await user.create({
    nome: userObject?.nome || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    senha: userObject?.senha || "senhaValida",
  });
}

async function setSessionExpiresAt(token: string, expiresAt: Date) {
  await database.query({
    text: `UPDATE sessions SET expires_at = $2 WHERE token = $1;`,
    values: [token, expiresAt],
  });
}

const orchestrator = {
  clearDatabase,
  runPendingMigrations,
  createUser,
  setSessionExpiresAt,
};

export default orchestrator;
