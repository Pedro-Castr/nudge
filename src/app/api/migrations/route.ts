import { NextResponse } from "next/server";

import migrationService from "@server/services/migration";

export async function GET() {
  const pendingMigrations = await migrationService.getPendingMigrations();

  return NextResponse.json(pendingMigrations);
}

export async function POST() {
  const migratedMigrations = await migrationService.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return NextResponse.json(migratedMigrations, {
      status: 201,
    });
  }

  return NextResponse.json(migratedMigrations, {
    status: 200,
  });
}
