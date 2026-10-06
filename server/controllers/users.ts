import type { Request, Response } from "express";

import usersService from "../services/users";

async function create(request: Request, response: Response) {
  const userInputValues = request.body;

  const newUser = await usersService.create(userInputValues);

  return response.status(201).json(newUser);
}

export default {
  create,
};
