import type { AuthValues } from "@/features/auth/types/auth";

const API_URL = "/api";

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

  if (!response.ok) {
    throw new Error(data.message ?? "Não foi possível criar a conta.");
  }

  return data;
}
