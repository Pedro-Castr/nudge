import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import taskService from "@server/services/task";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    await taskService.reorder(user.id, body?.ids);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
