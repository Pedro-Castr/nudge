import { NextResponse, type NextRequest } from "next/server";

import sessionService from "@server/services/session";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get("session_id")?.value;

  if (token) {
    response.cookies.set("session_id", token, {
      path: "/",
      maxAge: sessionService.EXPIRATION_IN_MILLISECONDS / 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
