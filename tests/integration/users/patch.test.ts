import { beforeAll, describe, expect, test } from "vitest";
import { version as uuidVersion } from "uuid";
import orchestrator from "../../orchestrator";
import usersRepository from "../../../server/repositories/users";
import password from "../../../server/services/password";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH api/users/[email]", () => {
  describe("Usuário anônimo", () => {
    test("Com 'email' inexistente", async () => {
      const response = await fetch(
        "http://localhost:3000/api/users/emailInexistente",
        {
          method: "PATCH",
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

    test("Com 'email' duplicado", async () => {
      await orchestrator.createUser({
        email: "email1@nudge.com",
      });

      await orchestrator.createUser({
        email: "email2@nudge.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/users/email2@nudge.com`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@nudge.com",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta alteração.",
        status_code: 400,
      });
    });

    test("Com 'nome' único", async () => {
      const createdUser = await orchestrator.createUser({});

      const response = await fetch(
        `http://localhost:3000/api/users/${createdUser.email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: "nomeUnico",
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "nomeUnico",
        email: createdUser.email,
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("Com 'email' único", async () => {
      const createdUser = await orchestrator.createUser({});

      const response = await fetch(
        `http://localhost:3000/api/users/${createdUser.email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "emailUnico@nudge.com",
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: createdUser.nome,
        email: "emailUnico@nudge.com",
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("Com nova 'senha'", async () => {
      const createdUser = await orchestrator.createUser({
        senha: "novaSenha1",
      });

      const response = await fetch(
        `http://localhost:3000/api/users/${createdUser.email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senha: "novaSenha2",
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: createdUser.nome,
        email: createdUser.email,
        senha: responseBody.senha,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabase = await usersRepository.findOneByEmail(
        createdUser.email,
      );

      const correctPasswordMatch = await password.compare(
        "novaSenha2",
        userInDatabase.senha,
      );
      const incorrectPasswordMatch = await password.compare(
        "novaSenha1",
        userInDatabase.senha,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
