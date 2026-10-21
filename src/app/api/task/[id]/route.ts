import { NextResponse } from "next/server";

import { requireUser } from "@/features/auth/services/requireUser";
import { handleError } from "@infra/errors/handleError";
import taskService from "@server/services/task";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireUser();
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
    await requireUser();
    const { id } = await context.params;

    const task = await taskService.findOneById(id);

    return NextResponse.json(task);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireUser();

    const { id } = await context.params;

    await taskService.remove(id);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return handleError(error);
  }
}
