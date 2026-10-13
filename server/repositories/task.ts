import database from "@infra/connection";
import { TaskOptions } from "@server/types/task";
import { NotFoundError } from "@infra/errors/errors";

async function runInsertQuery(userId: string, userInputValues: TaskOptions) {
  const results = await database.query({
    text: `
      INSERT INTO
        tasks (user_id, nome, descricao, posicao)
      VALUES (
        $1,
        $2,
        $3,
        (SELECT COALESCE(MAX(posicao), 0) + 1 FROM tasks WHERE user_id = $1)
      )
      RETURNING
        *
      ;`,
    values: [userId, userInputValues.nome, userInputValues.descricao],
  });

  return results.rows[0];
}

async function runUpdateQuery(userInputValues: TaskOptions) {
  const results = await database.query({
    text: `
      UPDATE
        tasks
      SET
        nome = $2,
        descricao = $3,
        concluida = $4,
        posicao = $5,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
      ;`,
    values: [
      userInputValues.id,
      userInputValues.nome,
      userInputValues.descricao,
      userInputValues.concluida,
      userInputValues.posicao,
    ],
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
        tasks
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

const taskRepository = {
  runInsertQuery,
  runUpdateQuery,
  findOneById,
};

export default taskRepository;
