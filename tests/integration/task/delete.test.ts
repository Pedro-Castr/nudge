import orchestrator from "@tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE api/task[id]", () => {
  describe("Usuário anônimo", () => {
    test("Deletar tarefa existente", async () => {
      const createdUser = await orchestrator.createUser({});
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Um erro de autorização ocorreu.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      });
    });
  });

  describe("Usuário autenticado", () => {
    test("Deletar tarefa existente", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response1 = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response1.status).toBe(204);

      const response2 = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "GET",
        },
      );

      expect(response2.status).toBe(401);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "UnauthorizedError",
        message: "Um erro de autorização ocorreu.",
        action: "Faça novamente o login para continuar.",
        status_code: 401,
      });
    });

    test("Deletar tarefa inexistente", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/00000000-0000-0000-0000-000000000000`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "A tarefa informada não foi encontrada no sistema.",
        action: "Verifique se o ID informado está correto.",
        status_code: 404,
      });
    });
  });
});
