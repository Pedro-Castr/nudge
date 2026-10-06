import database from "../../infra/connection";
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

type UpdateUserOptions = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  created_at: Date;
  updated_at: Date;
};

async function create(userInputValues: UserOptions) {
  await validadeUniqueName(userInputValues.nome);
  await validadeUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues: UserOptions) {
    const results = await database.query({
      text: `
      INSERT INTO
        users (nome, email, senha)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.nome,
        userInputValues.email,
        userInputValues.senha,
      ],
    });

    return results.rows[0];
  }
}

async function update(nome: string, userInputValues: UserOptions) {
  const currentUser = await usersRepository.findOneByName(nome);

  if ("nome" in userInputValues) {
    await validadeUniqueName(userInputValues.nome);
  }

  if ("email" in userInputValues) {
    await validadeUniqueEmail(userInputValues.email);
  }

  if ("senha" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues: UpdateUserOptions) {
    const results = await database.query({
      text: `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
      ;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.nome,
        userWithNewValues.email,
        userWithNewValues.senha,
      ],
    });

    return results.rows[0];
  }
}

async function validadeUniqueName(username: string) {
  const results = await database.query({
    text: `
      SELECT
        nome
      FROM
        users
      WHERE
        LOWER(nome) = LOWER($1)
      ;`,
    values: [username],
  });

  if (results.rowCount && results.rowCount > 0) {
    throw new ValidationError({
      message: "O nome informado já está sendo utilizado.",
      action: "Utilize outro nome para realizar esta operação.",
    });
  }
}

async function validadeUniqueEmail(email: string) {
  const results = await database.query({
    text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (results.rowCount && results.rowCount > 0) {
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
  validadeUniqueName,
  validadeUniqueEmail,
};

export default usersService;
