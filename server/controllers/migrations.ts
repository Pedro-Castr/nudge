import type { Request, Response } from "express";

import migrator from "../../infra/migrator";

async function get(request: Request, response: Response) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return response.status(200).json(pendingMigrations);
}

async function post(request: Request, response: Response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}

const migrationsController = {
  get,
  post,
};

export default migrationsController;
