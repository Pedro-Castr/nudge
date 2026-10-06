import { beforeAll, describe, expect, test } from "vitest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";
import user from "../../../server/repositories/users";
import password from "../../../server/services/password";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST api/users", () => {
  describe("Usuário anônimo", () => {
    test("Com dados únicos e válidos", async () => {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "usuarioteste",
          email: "usuarioteste@nugde.com",
          senha: "abc123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "usuarioteste",
        email: "usuarioteste@nugde.com",
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByName("usuarioteste");
      const correctPasswordMatch = await password.compare(
        "abc123",
        userInDatabase.senha,
      );
      const incorrectPasswordMatch = await password.compare(
        "SenhaErrada",
        userInDatabase.senha,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("Com 'email' duplicado", async () => {
      const response1 = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "emailduplicado1",
          email: "duplicado@nugde.com",
          senha: "abc123",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "emailduplicado2",
          email: "Duplicado@nugde.com",
          senha: "abc123",
        }),
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta alteração.",
        status_code: 400,
      });
    });

    test("Com 'nome' duplicado", async () => {
      const response1 = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "nomeduplicado",
          email: "nomeduplicado1@nugde.com",
          senha: "abc123",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "nomeduplicado",
          email: "nomeduplicado2@nugde.com",
          senha: "abc123",
        }),
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O nome informado já está sendo utilizado.",
        action: "Utilize outro nome para realizar esta operação.",
        status_code: 400,
      });
    });
  });
});
