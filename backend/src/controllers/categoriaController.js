import { categoria } from "../models/index.js";

export const listarcategoria = async (req, res) => {
    try {
        const categorias = await categoria.findAll()
        if (!categorias) return res.status(404).json({message: "Ainda não há atividades cadastradas"})
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({message: "Houve um problema no servidor", errMessage: error.message})
    }
}

export const listarCategoriaPorId = async (req, res) => {
    const id = req.params.id;

    try {
        const categoriaFiltrada = await categoria.findByPk(id);
        if(!categoriaFiltrada) return res.status(404).json({message: "Não foi possível encontrar essa atividade!"})
        res.status(200).json(categoriaFiltrada)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const criarCategoria = async (req, res) => {
    const {nome, descricao} = req.body;
    
    if (!nome || nome.trim().length < 2) return res.status(400).json({message: "O nome da categoria deve ter ao menos 2 caracteres"})

    try {
        const categoriaExiste = await categoria.findOne({where: {nome: `${nome}`}})
        if (categoriaExiste) return res.status(404).json({message: "Já existe uma categoria com esse nome"})
        
        const novaCategoria = {nome, descricao}
        const categoriaCriada = await categoria.create(novaCategoria)
        res.status(201).json({message: "Categoria criada!", categoria: categoriaCriada})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const atualizarCategoria = async (req, res) => {
    const {nome, descricao} = req.body;
    const id = req.params.id
    try {
        const categoriaFiltrada = await categoria.findByPk(id);
        if(!categoriaFiltrada) return res.status(404).json({message: "Categoria não localizada"})

        if(nome !== undefined) categoria.nome = nome;
        if(descricao !== undefined) categoria.descricao = descricao

        categoriaFiltrada.update(nome, descricao);
        res.status(200).json({message: "Categoria atualizada com sucesso!", categoria: categoriaFiltrada})        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deletarCategoria = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriaFiltrada = categoria.findByPk(id);
        if (!categoriaFiltrada) return res.status(404).json({message: "Não foi possível localizar essa categoria"})
        await categoriaFiltrada.destroy();
        res.status(204).json({message: "Categoria apagada com sucesso!"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}