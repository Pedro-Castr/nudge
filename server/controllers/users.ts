import type { Request, Response } from "express";

import usersService from "../services/users";

async function create(request: Request, response: Response) {
  const userInputValues = request.body;

  const newUser = await usersService.create(userInputValues);

  return response.status(201).json(newUser);
}

async function update(request: Request<{ email: string }>, response: Response) {
  const { email } = request.params;
  const userInputValues = request.body;

  const updatedUser = await usersService.update(email, userInputValues);

  return response.status(200).json(updatedUser);
}

async function findOneByEmail(
  request: Request<{ email: string }>,
  response: Response,
) {
  const { email } = request.params;

  const user = await usersService.findOneByEmail(email);

  return response.status(200).json(user);
}

export default {
  create,
  update,
  findOneByEmail,
};
