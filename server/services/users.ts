import password from "@server/services/password";
import usersRepository from "@server/repositories/users";
import { ValidationError, NotFoundError } from "@infra/errors/errors";
import { type UserOptions } from "@server/types/users";

async function create(userInputValues: UserOptions) {
  await validadeUniqueEmail(userInputValues.email);
  await validadeEmptyName(userInputValues.nome);
  await validadeEmptyEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await usersRepository.runInsertQuery(userInputValues);
  return newUser;
}

async function update(id: string, userInputValues: UserOptions) {
  const currentUser = await usersRepository.findOneById(id);

  if ("nome" in userInputValues) {
    await validadeEmptyName(userInputValues.nome);
  }

  if ("email" in userInputValues) {
    await validadeUniqueEmail(userInputValues.email);
    await validadeEmptyEmail(userInputValues.email);
  }

  if ("senha" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await usersRepository.runUpdateQuery(userWithNewValues);
  return updatedUser;
}

async function remove(id: string) {
  await findOneById(id);

  const deletedUser = await usersRepository.runDeleteQuery(id);
  return deletedUser;
}

async function validadeUniqueEmail(email: string) {
  try {
    await usersRepository.findOneByEmail(email);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return;
    }
    throw error;
  }

  throw new ValidationError({
    message: "O email informado já está sendo utilizado.",
    action: "Utilize outro email para realizar esta alteração.",
  });
}

async function validadeEmptyName(name: string) {
  if (!name || name === "") {
    throw new ValidationError({
      message: "Nome é um campo obrigatório.",
      action: "Informe um nome para completar a ação.",
    });
  }
}

async function validadeEmptyEmail(email: string) {
  if (!email || email === "") {
    throw new ValidationError({
      message: "Email é um campo obrigatório.",
      action: "Informe um email para completar a ação.",
    });
  }
}

async function hashPasswordInObject(userInputValues: UserOptions) {
  const hashedPassword = await password.hash(userInputValues.senha);
  userInputValues.senha = hashedPassword;
}

async function findOneById(id: string) {
  const user = await usersRepository.findOneById(id);

  return user;
}

async function findOneByName(nome: string) {
  const user = await usersRepository.findOneByName(nome);

  return user;
}

async function findOneByEmail(email: string) {
  const user = await usersRepository.findOneByEmail(email);

  return user;
}

const usersService = {
  create,
  update,
  remove,
  validadeUniqueEmail,
  validadeEmptyName,
  validadeEmptyEmail,
  findOneById,
  findOneByName,
  findOneByEmail,
};

export default usersService;
