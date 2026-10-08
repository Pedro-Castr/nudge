import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
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
