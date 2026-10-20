import orchestrator from "@tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE api/users/[id]", () => {
  describe("Usuário anônimo", () => {
    test("Deletar usuário existente e remover sessão", async () => {
      const createdUser = await orchestrator.createUser({
        nome: "usuariodeletado",
      });

      const session = await orchestrator.createSession(createdUser.id);

      const response1 = await fetch(
        `http://localhost:3000/api/users/${createdUser.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response1.status).toBe(204);

      const setCookie = response1.headers.get("set-cookie");

      expect(setCookie).toContain("session_id=");
      expect(setCookie).toMatch(/Expires=Thu, 01 Jan 1970/i);

      const response2 = await fetch(
        `http://localhost:3000/api/users/${createdUser.id}`,
        {
          method: "GET",
        },
      );

      expect(response2.status).toBe(404);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "O usuário informado não foi encontrado no sistema.",
        action: "Verifique se o ID informado está correto.",
        status_code: 404,
      });
    });

    test("Não permitir deletar a conta de outro usuário", async () => {
      const authenticatedUser = await orchestrator.createUser({
        nome: "usuarioautenticado",
      });

      const otherUser = await orchestrator.createUser({
        nome: "outrousuario",
      });

      const session = await orchestrator.createSession(authenticatedUser.id);

      const response = await fetch(
        `http://localhost:3000/api/users/${otherUser.id}`,
        {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O usuário informado não foi encontrado no sistema.",
        action: "Verifique se o ID informado está correto.",
        status_code: 404,
      });

      const userResponse = await fetch(
        `http://localhost:3000/api/users/${otherUser.id}`,
      );

      expect(userResponse.status).toBe(200);
    });

    test("Deletar usuário inexistente", async () => {
      const response = await fetch(
        "http://localhost:3000/api/users/00000000-0000-0000-0000-000000000000",
        {
          method: "DELETE",
        },
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
