import { NextResponse } from "next/server";

import {
  InternalServerError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "@infra/errors/errors";

type PublicError =
  ValidationError | NotFoundError | UnauthorizedError | InternalServerError;

function toResponse(error: PublicError) {
  return NextResponse.json(
    {
      name: error.name,
      message: error.message,
      action: error.action,
      status_code: error.statusCode,
    },
    { status: error.statusCode },
  );
}

export function handleError(error: unknown) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return toResponse(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);

  return NextResponse.json(publicErrorObject, {
    status: publicErrorObject.statusCode,
  });
}
