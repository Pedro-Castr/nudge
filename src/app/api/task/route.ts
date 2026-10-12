import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import taskService from "@server/services/task";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado.", statusCode: 401 },
        { status: 401 },
      );
    }

    const { nome, descricao } = await request.json();
    const task = await taskService.create(user.id, { nome, descricao });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
