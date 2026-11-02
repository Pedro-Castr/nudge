export interface Task {
  id: string;
  nome: string;
  descricao: string | null;
  completed_at: Date | null;
  posicao: number;
}

export interface CreateTaskValues {
  nome: string;
  descricao?: string;
}

export type UpdateTaskValues = Partial<
  Pick<Task, "nome" | "descricao" | "completed_at">
>;
