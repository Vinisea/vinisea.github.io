import bcrypt from "bcrypt";
import { createHash } from "node:crypto";

const criarHashSimples = (senha) =>
  createHash("sha256").update(senha).digest("hex");

export const gerarHashSenha = (senha) =>
  bcrypt.hash(criarHashSimples(senha), 12);

export const compararSenha = (senha, hash) =>
  bcrypt.compare(criarHashSimples(senha), hash);
