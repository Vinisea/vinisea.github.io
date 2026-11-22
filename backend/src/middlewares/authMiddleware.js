import jwt from "jsonwebtoken";
import { usuario } from "../models/index.js";
import { obterSegredoJwt } from "../config/jwt.js";

export const autenticar = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const [tipo, token, ...partes] = authorization?.split(" ") || [];

  if (tipo !== "Bearer" || !token || partes.length > 0) {
    return res.status(401).json({ message: "Token de autenticação não informado" });
  }

  try {
    const payload = jwt.verify(token, obterSegredoJwt());
    if (!payload || typeof payload !== "object" || !Number.isInteger(payload.id_usuario)) {
      return res.status(401).json({ message: "Token de autenticação inválido" });
    }

    const usuarioAutenticado = await usuario.findByPk(payload.id_usuario);
    if (!usuarioAutenticado) {
      return res.status(401).json({ message: "Token de autenticação inválido" });
    }

    req.usuario = usuarioAutenticado;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token de autenticação inválido ou expirado" });
    }

    if (error.message.includes("JWT_SECRET")) {
      return res.status(500).json({ message: "A autenticação não está configurada corretamente" });
    }

    res.status(500).json({ message: "Houve um problema ao validar a autenticação" });
  }
};
