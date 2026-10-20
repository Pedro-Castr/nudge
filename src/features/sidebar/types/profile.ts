export interface Profile {
  id: string;
  nome: string;
  email: string;
  senha?: string;
}

export interface UpdateProfileValues {
  nome?: string;
  email?: string;
  senha?: string;
}
