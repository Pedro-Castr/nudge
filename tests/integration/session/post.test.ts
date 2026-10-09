import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";
import orchestrator from "@tests/orchestrator";
import sessionService from "@server/services/session";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/session", () => {
  describe("Usuário Anônimo", () => {
    test("Com 'email' incorreto mas 'senha' correta", async () => {
      await orchestrator.createUser({
        senha: "senha-correta",
      });

      const response = await fetch("http://localhost:3000/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email-errado@nudge.com",
          senha: "senha-correta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });

    test("Com 'email' correto mas 'senha' incorreta", async () => {
      await orchestrator.createUser({
        email: "email.correto@nudge.com",
      });

      const response = await fetch("http://localhost:3000/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.correto@nudge.com",
          senha: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });

    test("Com 'email' incorreto e 'senha' incorreta", async () => {
      await orchestrator.createUser({});

      const response = await fetch("http://localhost:3000/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email.incorreto@nudge.com",
          senha: "senha-incorreta",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });

    test("Com 'email' correto e 'senha' correta", async () => {
      const createdUser = await orchestrator.createUser({
        email: "tudo.correto@nudge.com",
        senha: "tudo-correto",
      });

      const response = await fetch("http://localhost:3000/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "tudo.correto@nudge.com",
          senha: "tudo-correto",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

      const diff =
        new Date(responseBody.expires_at).getTime() -
        new Date(responseBody.created_at).getTime();

      expect(
        Math.abs(diff - sessionService.EXPIRATION_IN_MILLISECONDS),
      ).toBeLessThan(1000);

      const parsedSetCokie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCokie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        maxAge: sessionService.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        expires: parsedSetCokie.session_id.expires,
      });
    });
  });
});
