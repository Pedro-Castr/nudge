import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { handleError } from "@infra/errors/handleError";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
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

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado.", statusCode: 401 },
        { status: 401 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_id")?.value;

    if (token) {
      await sessionService.remove(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("session_id");

    return response;
  } catch (error) {
    return handleError(error);
  }
}
