import { version as uuidVersion } from "uuid";
import orchestrator from "@tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/task", () => {
  describe("Usuário autenticado", () => {
    test("Com 'nome' e com 'descrição'", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/task/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
        body: JSON.stringify({
          nome: "tarefa-teste",
          descricao: "descricao-teste",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: "tarefa-teste",
        descricao: "descricao-teste",
        concluida: false,
        posicao: 1,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);

      const createdAt = new Date(responseBody.created_at);
      const updatedAt = new Date(responseBody.updated_at);

      expect(createdAt).not.toBeNaN();
      expect(updatedAt).not.toBeNaN();

      createdAt.setSeconds(0);
      updatedAt.setSeconds(0);

      expect(createdAt).toEqual(updatedAt);
    });

    test("Com 'nome' mas sem 'descrição'", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/task/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
        body: JSON.stringify({
          nome: "tarefa-teste",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: "tarefa-teste",
        descricao: null,
        concluida: false,
        posicao: 1,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);

      const createdAt = new Date(responseBody.created_at);
      const updatedAt = new Date(responseBody.updated_at);

      expect(createdAt).not.toBeNaN();
      expect(updatedAt).not.toBeNaN();

      createdAt.setSeconds(0);
      updatedAt.setSeconds(0);

      expect(createdAt).toEqual(updatedAt);
    });

    test("Com 'nome' em branco", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/task/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
        body: JSON.stringify({
          descricao: "descricao",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Nome é um campo obrigatório.",
        action: "Informe um nome para completar a ação.",
        status_code: 400,
      });
    });
  });
});
