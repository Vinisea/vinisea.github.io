import bcrypt from "bcrypt";
import { createHash } from "node:crypto";

export const gerarHashSenha = (senha) => bcrypt.hash(senha, 12);

export const compararSenha = (senha, hash) => bcrypt.compare(senha, hash);
