import database from "@infra/connection";
import { TaskOptions } from "@server/types/task";

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

const taskRepository = {
  runInsertQuery,
};

export default taskRepository;
