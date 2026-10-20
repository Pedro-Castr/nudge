import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import sessionService from "@server/services/session";
import usersService from "@server/services/users";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import { handleError } from "@infra/errors/handleError";
import { NotFoundError } from "@infra/errors/errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const user = await usersService.findOneById(id);

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const user = await usersService.update(id, body);

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user || user.id !== id) {
      throw new NotFoundError({
        message: "O usuário informado não foi encontrado no sistema.",
        action: "Verifique se o ID informado está correto.",
      });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("session_id")?.value;

    if (token) {
      await sessionService.remove(token);
    }

    await usersService.remove(id);

    const response = new NextResponse(null, { status: 204 });
    response.cookies.delete("session_id");

    return response;
  } catch (error) {
    return handleError(error);
  }
}
