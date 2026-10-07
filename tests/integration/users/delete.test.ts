import { beforeAll, describe, expect, test } from "vitest";
import orchestrator from "../../orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE api/users/[email]", () => {
  describe("Usuário anônimo", () => {
    test("Deletar usuário existente", async () => {
      const createdUser = await orchestrator.createUser({
        nome: "usuariodeletado",
      });

      const response1 = await fetch(
        `http://localhost:3000/api/users/${createdUser.email}`,
        {
          method: "DELETE",
        },
      );

      expect(response1.status).toBe(204);

      const response2 = await fetch(
        `http://localhost:3000/api/users/${createdUser.email}`,
        {
          method: "GET",
        },
      );

      expect(response2.status).toBe(404);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
        status_code: 404,
      });
    });

    test("Deletar usuário inexistente", async () => {
      const response = await fetch(
        "http://localhost:3000/api/users/emailInexistente",
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
