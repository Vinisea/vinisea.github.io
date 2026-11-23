import { atividade, categoria } from "../models/index.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const pastaUploads = path.resolve(diretorioAtual, "../../uploads");

const removerImagemAntiga = async (imgUrl) => {
  if (!imgUrl?.startsWith("/uploads/")) return;

  const nomeArquivo = path.basename(imgUrl);
  await fs.unlink(path.join(pastaUploads, nomeArquivo)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
};

const incluirCategoria = {
  model: categoria,
  as: "categoria",
  attributes: ["id_categoria", "nome"],
};

export const listarAtividades = async (req, res) => {
  try {
    const atividades = await atividade.findAll({
      include: [incluirCategoria],
      order: [["dataEntrega", "DESC"]],
    });

    res.status(200).json(atividades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listarAtividadePorId = async (req, res) => {
  const id = req.params.id;

  try {
    const atividadeFiltrada = await atividade.findByPk(id, {
      include: [incluirCategoria],
    });
    if (!atividadeFiltrada) {
      return res.status(404).json({ message: "Atividade não localizada" });
    }

    res.status(200).json(atividadeFiltrada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cadastrarAtividade = async (req, res) => {
  const { titulo, descricao, tecnologias, instituicao, habilidades, dataEntrega, id_categoria } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Envie uma imagem no campo imagem" });
  }

  const img_url = `/uploads/${req.file.filename}`;

  try {
    const categoriaExiste = await categoria.findByPk(id_categoria);
    if (!categoriaExiste) {
      await removerImagemAntiga(img_url);
      return res.status(400).json({ message: "A categoria informada não existe" });
    }

    const atividadeCriada = await atividade.create({
      titulo,
      descricao,
      tecnologias,
      instituicao,
      habilidades,
      dataEntrega,
      img_url,
      id_categoria,
      id_usuario: req.usuario.id_usuario,
    });

    const atividadeComCategoria = await atividade.findByPk(
      atividadeCriada.id_atividade,
      { include: [incluirCategoria] },
    );

    res.status(201).json({
      message: "Atividade criada com sucesso!",
      atividade: atividadeComCategoria,
    });
  } catch (error) {
    await removerImagemAntiga(img_url);
    res.status(500).json({ message: error.message });
  }
};

export const atualizarAtividade = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const novaImagem = req.file ? `/uploads/${req.file.filename}` : undefined;
  const dadosAtividade = {
    titulo: body.titulo,
    descricao: body.descricao,
    tecnologias: body.tecnologias,
    instituicao: body.instituicao,
    habilidades: body.habilidades,
    dataEntrega: body.dataEntrega,
    img_url: novaImagem,
    id_categoria: body.id_categoria,
  };

  Object.keys(dadosAtividade).forEach((campo) => {
    if (dadosAtividade[campo] === undefined) {
      delete dadosAtividade[campo];
    }
  });

  try {
    const atividadeFiltrada = await atividade.findByPk(id);
    if (!atividadeFiltrada) {
      if (novaImagem) await removerImagemAntiga(novaImagem);
      return res.status(404).json({ message: "Atividade não localizada" });
    }

    if (dadosAtividade.id_categoria !== undefined) {
      const categoriaExiste = await categoria.findByPk(dadosAtividade.id_categoria);
      if (!categoriaExiste) {
        if (novaImagem) await removerImagemAntiga(novaImagem);
        return res.status(400).json({ message: "A categoria informada não existe" });
      }
    }

    const imagemAnterior = atividadeFiltrada.img_url;
    await atividadeFiltrada.update(dadosAtividade);
    if (novaImagem && imagemAnterior !== novaImagem) {
      await removerImagemAntiga(imagemAnterior);
    }
    const atividadeAtualizada = await atividade.findByPk(id, {
      include: [incluirCategoria],
    });

    res.status(200).json({
      message: "Atividade atualizada com sucesso!",
      atividade: atividadeAtualizada,
    });
  } catch (error) {
    if (novaImagem) await removerImagemAntiga(novaImagem);
    res.status(500).json({ message: error.message });
  }
};

export const deletarAtividade = async (req, res) => {
  const id = req.params.id;

  try {
    const atividadeFiltrada = await atividade.findByPk(id);
    if (!atividadeFiltrada) {
      return res.status(404).json({ message: "Atividade não localizada" });
    }

    const imagemAnterior = atividadeFiltrada.img_url;
    await atividadeFiltrada.destroy();
    await removerImagemAntiga(imagemAnterior);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
