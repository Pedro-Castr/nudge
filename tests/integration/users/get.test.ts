import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET api/users/[id]", () => {
  describe("Usuário anônimo", () => {
    test("Usuário existente", async () => {
      const createdUser = await orchestrator.createUser({});

      const response = await fetch(
        `http://localhost:3000/api/users/${createdUser.id}`,
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: responseBody.nome,
        email: responseBody.email,
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Usuário inexistente", async () => {
      const response = await fetch(
        `http://localhost:3000/api/users/00000000-0000-0000-0000-000000000000`,
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O usuário informado não foi encontrado no sistema.",
        action: "Verifique se o ID informado está correto.",
        status_code: 404,
      });
    });
  });
});
