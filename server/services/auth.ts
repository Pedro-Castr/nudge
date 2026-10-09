import usersService from "./users";
import password from "./password";
import { NotFoundError, UnauthorizedError } from "@infra/errors/errors";

async function getAuthenticatedUser(
  providedEmail: string,
  providedPassword: string,
) {
  try {
    const storedUser = await findOneByEmail(providedEmail);
    await validadePassword(providedPassword, storedUser.senha);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos",
      });
    }

    throw error;
  }

  async function findOneByEmail(providedEmail: string) {
    let storedUser;

    try {
      storedUser = await usersService.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere",
          action: "Verifique se este dado está correto.",
        });
      }

      throw error;
    }

    return storedUser;
  }

  async function validadePassword(
    providedPassword: string,
    storedPassword: string,
  ) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere",
        action: "Verifique se este dado está correto.",
      });
    }
  }
}

const authService = {
  getAuthenticatedUser,
};

export default authService;
