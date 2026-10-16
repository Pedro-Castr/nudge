import { version as uuidVersion } from "uuid";
import orchestrator from "@tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET api/task/[id]", () => {
  describe("Usuário anônimo", () => {
    test("Tarefa existente", async () => {
      const createdUser = await orchestrator.createUser({});
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
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
    test("Tarefa inexistente", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/00000000-0000-0000-0000-000000000000`,
        {
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

    test("Tarefa existente", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: responseBody.nome,
        descricao: responseBody.descricao,
        concluida: responseBody.concluida,
        posicao: responseBody.posicao,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
  });
});

describe("GET api/task", () => {
  describe("Usuário autenticado", () => {
    test("Sem tarefas", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/task`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual([]);
    });

    test("Com uma tarefa", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      await orchestrator.createTask(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/task`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveLength(1);

      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        user_id: createdUser.id,
        nome: responseBody[0].nome,
        descricao: responseBody[0].descricao,
        concluida: responseBody[0].concluida,
        posicao: responseBody[0].posicao,
        created_at: responseBody[0].created_at,
        updated_at: responseBody[0].updated_at,
      });

      expect(uuidVersion(responseBody[0].id)).toBe(4);
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();
    });

    test("Com duas tarefas", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      await orchestrator.createTask(createdUser.id);
      await orchestrator.createTask(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/task`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveLength(2);

      expect(responseBody[0]).toEqual({
        id: responseBody[0].id,
        user_id: createdUser.id,
        nome: responseBody[0].nome,
        descricao: responseBody[0].descricao,
        concluida: responseBody[0].concluida,
        posicao: responseBody[0].posicao,
        created_at: responseBody[0].created_at,
        updated_at: responseBody[0].updated_at,
      });

      expect(uuidVersion(responseBody[0].id)).toBe(4);
      expect(Date.parse(responseBody[0].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[0].updated_at)).not.toBeNaN();

      expect(responseBody[1]).toEqual({
        id: responseBody[1].id,
        user_id: createdUser.id,
        nome: responseBody[1].nome,
        descricao: responseBody[1].descricao,
        concluida: responseBody[1].concluida,
        posicao: responseBody[1].posicao,
        created_at: responseBody[1].created_at,
        updated_at: responseBody[1].updated_at,
      });

      expect(uuidVersion(responseBody[1].id)).toBe(4);
      expect(Date.parse(responseBody[1].created_at)).not.toBeNaN();
      expect(Date.parse(responseBody[1].updated_at)).not.toBeNaN();
    });
  });
});
