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

async function runDeleteQuery(id: string) {
  await database.query({
    text: `
      DELETE FROM
        tasks
      WHERE
        id = $1
      ;`,
    values: [id],
  });
}

async function findOneById(id: string) {
  const taskFound = await runSelectQuery(id);

  return taskFound;

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
        message: "A tarefa informada não foi encontrada no sistema.",
        action: "Verifique se o ID informado está correto.",
      });
    }

    return results.rows[0];
  }
}

async function findTasksByUserId(userId: string) {
  const taskList = await runSelectQuery(userId);

  return taskList;

  async function runSelectQuery(userId: string) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        tasks
      WHERE
        user_id = $1
      ORDER BY
        posicao ASC;
      ;`,
      values: [userId],
    });

    return results.rows;
  }
}

async function UpdateTaskPositions(userId: string, taskIds: string[]) {
  await runSelectQuery(userId, taskIds);

  async function runSelectQuery(userId: string, taskIds: string[]) {
    await database.query({
      text: `
      WITH ordered AS (
        SELECT
          id,
          ROW_NUMBER() OVER (
            ORDER BY
              COALESCE(ARRAY_POSITION($2::uuid[], id), 2147483647),
              posicao,
              created_at
          )::int AS nova_posicao
        FROM
          tasks
        WHERE
          user_id = $1
      )
      UPDATE
        tasks
      SET
        posicao = ordered.nova_posicao
      FROM
        ordered
      WHERE
        tasks.id = ordered.id
        AND tasks.posicao IS DISTINCT FROM ordered.nova_posicao
    ;`,
      values: [userId, taskIds],
    });
  }
}

const taskRepository = {
  runInsertQuery,
  runUpdateQuery,
  runDeleteQuery,
  findOneById,
  findTasksByUserId,
  UpdateTaskPositions,
};

export default taskRepository;
