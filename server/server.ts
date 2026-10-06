import dotenv from "dotenv";
dotenv.config({
  path: ".env.development",
});

import express from "express";

import usersRoutes from "./routes/users";

const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);

app.listen(3000);
