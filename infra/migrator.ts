import { runner as migrationRunner } from "node-pg-migrate";
import { resolve } from "node:path";
import connection from "./connection";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up" as const,
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  const dbClient = await connection.getNewClient();

  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  const dbClient = await connection.getNewClient();

  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
