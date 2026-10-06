import database from "../../infra/connection";
import { NotFoundError } from "../../infra/errors/errors";
import { UserOptions, UpdateUserOptions } from "../types/users";

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

async function findOneByName(name: string) {
  const userFound = await runSelectQuery(name);

  return userFound;

  async function runSelectQuery(name: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(nome) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [name],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O nome informado não foi encontrado no sistema.",
        action: "Verifique se o nome está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneByEmail(email: string) {
  const userFound = await runSelectQuery(email);

  return userFound;

  async function runSelectQuery(email: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

const usersRepository = {
  runInsertQuery,
  runUpdateQuery,
  findOneByName,
  findOneByEmail,
};

export default usersRepository;
