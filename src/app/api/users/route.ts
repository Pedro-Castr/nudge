import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import usersService from "@server/services/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await usersService.create(body);

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Usuário não autenticado.",
          action: "Faça login para continuar.",
          statusCode: 401,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
