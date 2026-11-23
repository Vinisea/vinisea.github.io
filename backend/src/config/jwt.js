export const obterSegredoJwt = () => {
  const segredo = process.env.JWT_SECRET;

  if (!segredo || segredo.length < 32) {
    throw new Error("JWT_SECRET deve conter ao menos 32 caracteres");
  }

  return segredo;
};

export const tempoExpiracaoJwt = process.env.JWT_EXPIRES_IN || "1d";
