import { NextResponse } from "next/server";

import taskService from "@server/services/task";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const deletedCount = await taskService.deleteExpiredTasks();

    return NextResponse.json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error("Erro ao excluir tarefas expiradas:", error);

    return NextResponse.json(
      { message: "Não foi possível executar a limpeza." },
      { status: 500 },
    );
  }
}
