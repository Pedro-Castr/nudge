import { NextResponse } from "next/server";

import { handleError } from "@infra/errors/handleError";
import authService from "@server/services/auth";
import sessionService from "@server/services/session";

export async function POST(request: Request) {
  try {
    const userInputValues = await request.json();

    const authenticatedUser = await authService.getAuthenticatedUser(
      userInputValues.email,
      userInputValues.senha,
    );

    const newSession = await sessionService.create(authenticatedUser.id);

    const response = NextResponse.json(newSession, {
      status: 201,
    });

    response.cookies.set("session_id", newSession.token, {
      path: "/",
      maxAge: sessionService.EXPIRATION_IN_MILLISECONDS / 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
