import migrator from "@infra/migrator";

async function getPendingMigrations() {
  return await migrator.listPendingMigrations();
}

async function runPendingMigrations() {
  return await migrator.runPendingMigrations();
}

const migrationsService = {
  getPendingMigrations,
  runPendingMigrations,
};

export default migrationsService;
