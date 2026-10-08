import { NextResponse } from "next/server";

import { InternalServerError, ValidationError, NotFoundError } from "./errors";

export function handleError(error: unknown) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return NextResponse.json(error, {
      status: error.statusCode,
    });
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);

  return NextResponse.json(publicErrorObject, {
    status: publicErrorObject.statusCode,
  });
}
