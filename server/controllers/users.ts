import type { Request, Response } from "express";

import usersService from "../services/users";

async function create(request: Request, response: Response) {
  const userInputValues = request.body;

  const newUser = await usersService.create(userInputValues);

  return response.status(201).json(newUser);
}

async function update(request: Request<{ id: string }>, response: Response) {
  const { id } = request.params;
  const userInputValues = request.body;

  const updatedUser = await usersService.update(id, userInputValues);

  return response.status(200).json(updatedUser);
}

async function remove(request: Request<{ id: string }>, response: Response) {
  const { id } = request.params;

  const deletedUser = await usersService.remove(id);
  return response.status(204).json(deletedUser);
}

async function findOneById(
  request: Request<{ id: string }>,
  response: Response,
) {
  const { id } = request.params;

  const user = await usersService.findOneById(id);

  return response.status(200).json(user);
}

const usersControler = {
  create,
  update,
  remove,
  findOneById,
};

export default usersControler;
