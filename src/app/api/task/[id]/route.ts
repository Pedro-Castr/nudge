import { NextResponse } from "next/server";

import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import { handleError } from "@infra/errors/handleError";
import taskService from "@server/services/task";
import { UnauthorizedError } from "@infra/errors/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const task = await taskService.update(id, body);

    return NextResponse.json(task);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { id } = await context.params;

    const task = await taskService.findOneById(id);

    return NextResponse.json(task);
  } catch (error) {
    return handleError(error);
  }
}
