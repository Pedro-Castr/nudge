import { TaskOptions } from "@server/types/task";
import taskRepository from "@server/repositories/task";
import { ValidationError } from "@infra/errors/errors";

async function create(userId: string, userInputValues: TaskOptions) {
  await validateEmptyName(userInputValues.nome);

  const newTask = await taskRepository.runInsertQuery(userId, userInputValues);
  return newTask;
}

async function update(id: string, userInputValues: TaskOptions) {
  const currentTask = await taskRepository.findOneById(id);

  if ("nome" in userInputValues) {
    await validateEmptyName(userInputValues.nome);
  }

  const taskWithNewValues = { ...currentTask, ...userInputValues };

  const updatedTask = await taskRepository.runUpdateQuery(taskWithNewValues);
  return updatedTask;
}

async function validateEmptyName(name: string) {
  if (!name || name === "") {
    throw new ValidationError({
      message: "Nome é um campo obrigatório.",
      action: "Informe um nome para completar a ação.",
    });
  }
}

const taskService = {
  create,
  update,
};

export default taskService;
