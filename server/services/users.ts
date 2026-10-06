import password from "../services/password";
import usersRepository from "../repositories/users";
import { ValidationError } from "../../infra/errors/errors";

export type UserOptions = {
  id?: string;
  nome: string;
  email: string;
  senha: string;
  created_at?: Date;
  updated_at?: Date;
};

async function create(userInputValues: UserOptions) {
  await validadeUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await usersRepository.runInsertQuery(userInputValues);
  return newUser;
}

async function update(nome: string, userInputValues: UserOptions) {
  const currentUser = await usersRepository.findOneByName(nome);

  if ("email" in userInputValues) {
    await validadeUniqueEmail(userInputValues.email);
  }

  if ("senha" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await usersRepository.runUpdateQuery(userWithNewValues);
  return updatedUser;
}

async function validadeUniqueEmail(email: string) {
  const user = await usersRepository.findOneByEmail(email);

  if (user) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta alteração.",
    });
  }
}

async function hashPasswordInObject(userInputValues: UserOptions) {
  const hashedPassword = await password.hash(userInputValues.senha);
  userInputValues.senha = hashedPassword;
}

const usersService = {
  create,
  update,
  validadeUniqueEmail,
};

export default usersService;
