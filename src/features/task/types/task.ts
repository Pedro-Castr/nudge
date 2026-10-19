export interface Task {
  id: string;
  nome: string;
  descricao: string | null;
  concluida: boolean;
  posicao: number;
}

export interface CreateTaskValues {
  nome: string;
  descricao?: string;
}

export type UpdateTaskValues = Partial<
  Pick<Task, "nome" | "descricao" | "concluida">
>;
