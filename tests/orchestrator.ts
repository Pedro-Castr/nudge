import { faker } from "@faker-js/faker";
import database from "@infra/connection";
import migrator from "@infra/migrator";
import sessionService from "@server/services/session";
import taskService from "@server/services/task";
import user from "@server/services/users";
import { TaskOptions } from "@server/types/task";

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

async function createSession(userId: string) {
  return await sessionService.create(userId);
}

async function setSessionExpiresAt(token: string, expiresAt: Date) {
  await database.query({
    text: `UPDATE sessions SET expires_at = $2 WHERE token = $1;`,
    values: [token, expiresAt],
  });
}

async function createTask(userId: string, taskObject?: TaskOptions) {
  return await taskService.create(userId, {
    nome: taskObject?.nome || faker.lorem.words(3),
    descricao: taskObject?.descricao || faker.lorem.sentence(),
  });
}

const orchestrator = {
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
  setSessionExpiresAt,
  createTask,
};

export default orchestrator;
