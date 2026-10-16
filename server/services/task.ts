import { TaskOptions } from "@server/types/task";
import taskRepository from "@server/repositories/task";
import { ValidationError } from "@infra/errors/errors";

async function create(userId: string, userInputValues: TaskOptions) {
  validateEmptyName(userInputValues.nome);

  const newTask = await taskRepository.runInsertQuery(userId, userInputValues);
  return newTask;
}

async function update(id: string, userInputValues: TaskOptions) {
  const currentTask = await taskRepository.findOneById(id);

  if ("nome" in userInputValues) {
    validateEmptyName(userInputValues.nome);
  }

  const taskWithNewValues = { ...currentTask, ...userInputValues };

  const updatedTask = await taskRepository.runUpdateQuery(taskWithNewValues);
  return updatedTask;
}

async function remove(id: string) {
  await findOneById(id);

  return await taskRepository.runDeleteQuery(id);
}

async function findOneById(id: string) {
  return await taskRepository.findOneById(id);
}

async function findTasksByUserId(userId: string) {
  return await taskRepository.findTasksByUserId(userId);
}

function validateEmptyName(name: unknown) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError({
      message: "Nome é um campo obrigatório.",
      action: "Informe um nome para completar a ação.",
    });
  }
}

const taskService = {
  create,
  update,
  remove,
  findOneById,
  findTasksByUserId,
};

export default taskService;
