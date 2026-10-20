import type {
  CreateTaskValues,
  UpdateTaskValues,
  Task,
} from "@/features/task/types/task";

const API_URL = "/api";

async function createTask(values: CreateTaskValues): Promise<Task> {
  const response = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: values.nome,
      descricao: values.descricao,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

async function updateTask(
  id: string,
  changes: UpdateTaskValues,
): Promise<Task> {
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

async function deleteTask(id: string) {
  const response = await fetch(`${API_URL}/task/${id}`, {
    method: "DELETE",
  });

  if (response.ok) return;
  const data = await response.json().catch(() => null);
  throw new Error(data?.message);
}

async function getTasksByUserId() {
  const response = await fetch(`${API_URL}/task/`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
}

async function reorderTasks(ids: string[]): Promise<void> {
  const response = await fetch(`${API_URL}/task/order`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (response.ok) return;

  const data = await response.json().catch(() => null);
  throw new Error(data?.message);
}

const taskService = {
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
  reorderTasks,
};

export default taskService;
