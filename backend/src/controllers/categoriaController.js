import { categoria } from "../models/index.js";

export const listarcategoria = async (req, res) => {
  try {
    const categorias = await categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listarCategoriaPorId = async (req, res) => {
  const id = req.params.id;

  try {
    const categoriaFiltrada = await categoria.findByPk(id);
    if (!categoriaFiltrada) {
      return res.status(404).json({ message: "Categoria não localizada" });
    }

    res.status(200).json(categoriaFiltrada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cadastrarCategoria = async (req, res) => {
  const { nome, descricao } = req.body || {};

  if (typeof nome !== "string" || nome.trim().length < 2) {
    return res.status(400).json({message: "O nome da categoria deve ter ao menos 2 caracteres",});
  }

  try {
    const categoriaExiste = await categoria.findOne({
      where: { nome: nome.trim() },
    });
    if (categoriaExiste) {
      return res.status(409).json({ message: "Já existe uma categoria com esse nome" });
    }

    const categoriaCriada = await categoria.create({
      nome: nome.trim(),
      descricao,
    });
    res.status(201).json({
      message: "Categoria criada!",
      categoria: categoriaCriada,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const atualizarCategoria = async (req, res) => {
  const { nome, descricao } = req.body || {};
  const id = req.params.id;
  const dadosAtualizacao = {};

  if (nome !== undefined) {
    if (nome.trim().length < 2) {
      return res.status(400).json({
        message: "O nome da categoria deve ter ao menos 2 caracteres",
      });
    }
    dadosAtualizacao.nome = nome.trim();
  }

  if (descricao !== undefined) dadosAtualizacao.descricao = descricao;

  try {
    const categoriaFiltrada = await categoria.findByPk(id);
    if (!categoriaFiltrada) {
      return res.status(404).json({ message: "Categoria não localizada" });
    }

    if (dadosAtualizacao.nome !== undefined) {
      const categoriaExiste = await categoria.findOne({
        where: { nome: dadosAtualizacao.nome },
      });
      if (categoriaExiste && categoriaExiste.id_categoria !== categoriaFiltrada.id_categoria) {
        return res.status(409).json({ message: "Já existe uma categoria com esse nome" });
      }
    }

    await categoriaFiltrada.update(dadosAtualizacao);
    res.status(200).json({
      message: "Categoria atualizada com sucesso!",
      categoria: categoriaFiltrada,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletarCategoria = async (req, res) => {
  const id = req.params.id;

  try {
    const categoriaFiltrada = await categoria.findByPk(id);
    if (!categoriaFiltrada) {
      return res.status(404).json({ message: "Não foi possível localizar essa categoria" });
    }

    await categoriaFiltrada.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};