import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import taskService from "@server/services/task";

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
