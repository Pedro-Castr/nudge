export type UserOptions = {
  id?: string;
  nome: string;
  email: string;
  senha: string;
  created_at?: Date;
  updated_at?: Date;
};

export type UpdateUserOptions = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  created_at: Date;
  updated_at: Date;
};
