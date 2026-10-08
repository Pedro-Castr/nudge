import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import usersService from "@server/services/users";

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

    await usersService.remove(id);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return handleError(error);
  }
}
