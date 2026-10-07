import type { AuthValues } from "../types/auth";

const API_URL = "http://localhost:3000/api";

export async function registerUser(values: AuthValues) {
  const response = await fetch(`${API_URL}/users`, {
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

  const data = await response.json();

  return data;
}
