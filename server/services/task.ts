import { TaskOptions } from "@server/types/task";
import taskRepository from "@server/repositories/task";
import { ValidationError } from "@infra/errors/errors";

async function create(userId: string, userInputValues: TaskOptions) {
  if (!userInputValues.nome || userInputValues.nome === "") {
    throw new ValidationError({
      message: "Nome é um campo obrigatório.",
      action: "Informe um nome para completar a ação.",
    });
  }

  const newTask = await taskRepository.runInsertQuery(userId, userInputValues);
  return newTask;
}

const taskService = {
  create,
};

export default taskService;
