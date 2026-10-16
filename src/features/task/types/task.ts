export interface Task {
  id: string;
  nome: string;
  descricao: string | null;
  concluida: boolean;
}

export interface CreateTaskValues {
  nome: string;
  descricao?: string;
}

export type UpdateTaskValues = Partial<
  Pick<Task, "nome" | "descricao" | "concluida">
>;
