import { apiFetch } from "@/lib/api";

import type { AuthValues } from "@/features/auth/types/auth";

const API_URL = "/api";

const registerUser = (values: AuthValues) =>
  apiFetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: values.nome,
      email: values.email,
      senha: values.senha,
    }),
  });

const loginUser = (values: AuthValues) =>
  apiFetch(`${API_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: values.email,
      senha: values.senha,
    }),
  });

const authService = {
  registerUser,
  loginUser,
};

export default authService;
