import type { Task, UpdateTaskValues } from "@/features/task/types/task";

export function getChanges(
  original: Task,
  edited: UpdateTaskValues,
): UpdateTaskValues {
  return Object.fromEntries(
    Object.entries(edited).filter(
      ([key, value]) =>
        value !== undefined && value !== original[key as keyof Task],
    ),
  ) as UpdateTaskValues;
}
