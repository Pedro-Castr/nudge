import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: ".env.development",
});

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { InternalServerError } from "../infra/errors/errors";
import usersRoutes from "./routes/users";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);

app.use(
  (
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    if (
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
    ) {
      return response.status(error.statusCode).json(error);
    }

    const internalServerError = new InternalServerError({
      cause: error,
    });

    return response
      .status(internalServerError.statusCode)
      .json(internalServerError);
  },
);

app.listen(3000);
