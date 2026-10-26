export type FormMode = "login" | "signup";

export interface AuthValues {
  nome: string;
  email: string;
  senha: string;
}

export type FieldErrors = {
  nome?: string;
  email?: string;
  senha?: string;
};
