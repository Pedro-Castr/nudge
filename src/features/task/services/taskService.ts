import { apiFetch } from "@/lib/api";

import type {
  CreateTaskValues,
  UpdateTaskValues,
  Task,
} from "@/features/task/types/task";

const API_URL = "/api";

const createTask = (values: CreateTaskValues) =>
  apiFetch<Task>(`${API_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

const updateTask = (id: string, changes: UpdateTaskValues) =>
  apiFetch<Task>(`${API_URL}/task/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

const deleteTask = (id: string) =>
  apiFetch(`${API_URL}/task/${id}`, { method: "DELETE" });

const getTasksByUserId = () => apiFetch(`${API_URL}/task/`);

const reorderTasks = (ids: string[]) =>
  apiFetch(`${API_URL}/task/order`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

const taskService = {
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
  reorderTasks,
};

export default taskService;
