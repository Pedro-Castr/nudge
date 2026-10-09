import database from "@infra/connection";
import { NotFoundError } from "@infra/errors/errors";
import { type UserOptions, type UpdateUserOptions } from "@server/types/users";

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
        nome = $2,
        email = $3,
        senha = $4,
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

async function runDeleteQuery(id: string) {
  const results = await database.query({
    text: `
      DELETE FROM
        users
      WHERE
        id = $1
      RETURNING
        *
      ;`,
    values: [id],
  });

  return results.rows[0];
}

async function findOneById(id: string) {
  const userFound = await runSelectQuery(id);

  return userFound;

  async function runSelectQuery(id: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        id = $1
      LIMIT
        1
      ;`,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O usuário informado não foi encontrado no sistema.",
        action: "Verifique se o ID informado está correto.",
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
  runDeleteQuery,
  findOneById,
  findOneByEmail,
};

export default usersRepository;
