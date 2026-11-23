import jwt from "jsonwebtoken";
import { obterSegredoJwt, tempoExpiracaoJwt } from "../config/jwt.js";
import { usuario } from "../models/index.js";
import { compararSenha, gerarHashSenha } from "../utils/senha.js";

const dadosPublicosUsuario = (usuarioEncontrado) => ({
  id_usuario: usuarioEncontrado.id_usuario,
  nome: usuarioEncontrado.nome,
  email: usuarioEncontrado.email,
});

const gerarToken = (usuarioEncontrado) =>
  jwt.sign(
    {
      id_usuario: usuarioEncontrado.id_usuario,
      email: usuarioEncontrado.email,
    },
    obterSegredoJwt(),
    { expiresIn: tempoExpiracaoJwt },
  );

export const listarUsuario = async (req, res) => {
  try {
    const usuarios = await usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const criarUsuario = async (req, res) => {
  const { nome, email, senha, verificarSenha } = req.body;

  if (!nome) return res.status(400).json({ message: "Por favor digite um nome" });
  if (!email) return res.status(400).json({ message: "Por favor digite um email" });
  if (!senha) return res.status(400).json({ message: "Por favor digite uma senha" });
  if (!verificarSenha) {
    return res.status(400).json({ message: "Por favor verifique a senha" });
  }
  if (senha !== verificarSenha) {
    return res.status(400).json({
      message: "A senha digitada não corresponde a mesma da verificação",
    });
  }
  if (senha.length < 8) {
    return res.status(400).json({ message: "A senha precisa ter no mínimo 8 caracteres" });
  }

  try {
    const usuarioExiste = await usuario.findOne();
    if (usuarioExiste) {
      return res.status(409).json({ message: "A conta já foi cadastrada" });
    }

    const novoUsuario = await usuario.create({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: await gerarHashSenha(senha),
    });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      token: gerarToken(novoUsuario),
      usuario: dadosPublicosUsuario(novoUsuario),
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Os dados do usuário são inválidos",
        erros: error.errors.map((item) => item.message),
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const autenticarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Informe o e-mail e a senha" });
  }

  try {
    const usuarioEncontrado = await usuario.scope("ComSenha").findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (
      !usuarioEncontrado ||
      !(await compararSenha(senha, usuarioEncontrado.senha))
    ) {
      return res.status(401).json({ message: "E-mail ou senha inválidos" });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token: gerarToken(usuarioEncontrado),
      usuario: dadosPublicosUsuario(usuarioEncontrado),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletarUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const usuarioFiltrado = await usuario.findByPk(id);
    if (!usuarioFiltrado) {
      return res.status(404).json({ message: "Usuario não encontrado!" });
    }

    await usuarioFiltrado.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
