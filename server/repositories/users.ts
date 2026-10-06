import database from "../../infra/connection";
import { NotFoundError } from "../../infra/errors/errors";

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
  findOneByName,
  findOneByEmail,
};

export default usersRepository;
