import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import { UnauthorizedError } from "@infra/errors/errors";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import taskService from "@server/services/task";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { nome, descricao } = await request.json();
    const task = await taskService.create(user.id, { nome, descricao });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(_request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const task = await taskService.findTasksByUserId(user.id);

    return NextResponse.json(task);
  } catch (error) {
    return handleError(error);
  }
}
