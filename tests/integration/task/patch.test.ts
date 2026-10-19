import { version as uuidVersion } from "uuid";
import orchestrator from "@tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH api/task/[id]", () => {
  describe("Usuário autenticado", () => {
    test("Com novo 'nome'", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
          body: JSON.stringify({
            nome: "novoNome",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: "novoNome",
        descricao: responseBody.descricao,
        concluida: responseBody.concluida,
        posicao: responseBody.posicao,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("Com nova 'descricao'", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
          body: JSON.stringify({
            descricao: "novaDescricao",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: responseBody.nome,
        descricao: "novaDescricao",
        concluida: responseBody.concluida,
        posicao: responseBody.posicao,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("Com 'descricao' em branco", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
          body: JSON.stringify({
            descricao: null,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: responseBody.nome,
        descricao: null,
        concluida: responseBody.concluida,
        posicao: responseBody.posicao,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("Com 'concluida' diferente", async () => {
      const createdUser = await orchestrator.createUser({});
      const session = await orchestrator.createSession(createdUser.id);
      const createdTask = await orchestrator.createTask(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/task/${createdTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${session.token}`,
          },
          body: JSON.stringify({
            concluida: true,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        user_id: createdUser.id,
        nome: responseBody.nome,
        descricao: responseBody.descricao,
        concluida: true,
        posicao: responseBody.posicao,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
  });
});
