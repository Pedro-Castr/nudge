import bcryptjs from "bcryptjs";

async function hash(password: string) {
  const rounds = getNumberOfRounds();
  const pepper = getPepper();
  const spicyPassword = password + pepper;
  return await bcryptjs.hash(spicyPassword, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function getPepper() {
  return process.env.PEPPER;
}

async function compare(providedPassword: string, storedPassword: string) {
  return await bcryptjs.compare(
    `${providedPassword + getPepper()}`,
    storedPassword,
  );
}

const password = {
  hash,
  compare,
};

export default password;
