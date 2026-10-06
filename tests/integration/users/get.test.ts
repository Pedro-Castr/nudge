import { beforeAll, describe, expect, test } from "vitest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET api/users/[email]", () => {
  describe("Usuário anônimo", () => {
    test("Com correspondência de maiúsculas e minúsculas", async () => {
      await orchestrator.createUser({
        email: "mesmoCase@nudge.com",
      });

      const response = await fetch(
        "http://localhost:3000/api/users/mesmoCase@nudge.com",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: responseBody.nome,
        email: "mesmoCase@nudge.com",
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Sem correspondência de maiúsculas e minúsculas", async () => {
      await orchestrator.createUser({
        email: "caseDiferente@nudge.com",
      });

      const response = await fetch(
        "http://localhost:3000/api/users/casediferente@nudge.com",
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: responseBody.nome,
        email: "caseDiferente@nudge.com",
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Com 'email' inexistente", async () => {
      const response = await fetch(
        "http://localhost:3000/api/users/emailinexistente@nudge.com",
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
