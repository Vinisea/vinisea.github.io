import { atividade, categoria } from "../models/index.js";

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
  const { titulo, descricao, tecnologias, instituicao, habilidades, dataEntrega, img_url, id_categoria }  = req.body;

  try {
    const categoriaExiste = await categoria.findByPk(id_categoria);
    if (!categoriaExiste) {
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
    res.status(500).json({ message: error.message });
  }
};

export const atualizarAtividade = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const dadosAtividade = {
    titulo: body.titulo,
    descricao: body.descricao,
    tecnologias: body.tecnologias,
    instituicao: body.instituicao,
    habilidades: body.habilidades,
    dataEntrega: body.dataEntrega,
    img_url: body.img_url,
    id_categoria: body.id_categoria,
  };

  try {
    const atividadeFiltrada = await atividade.findByPk(id);
    if (!atividadeFiltrada) {
      return res.status(404).json({ message: "Atividade não localizada" });
    }

    if (dadosAtividade.id_categoria !== undefined) {
      const categoriaExiste = await categoria.findByPk(dadosAtividade.id_categoria);
      if (!categoriaExiste) {
        return res.status(400).json({ message: "A categoria informada não existe" });
      }
    }

    await atividadeFiltrada.update(dadosAtividade);
    const atividadeAtualizada = await atividade.findByPk(id, {
      include: [incluirCategoria],
    });

    res.status(200).json({
      message: "Atividade atualizada com sucesso!",
      atividade: atividadeAtualizada,
    });
  } catch (error) {
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

    await atividadeFiltrada.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
