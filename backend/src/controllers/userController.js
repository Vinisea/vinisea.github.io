import { usuario } from "../models/index.js";

export const listarUsuario = async (req, res) => {
    try {
        const usuarios = await usuario.findAll();
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
export const criarUsuario = async (req, res) => {
    const {nome, email, senha, verificarSenha} = req.body
    
    if (!nome) return res.status(400).json({message: "Por favor digite um nome"});
    if (!email) return res.status(400).json({message: "Por favor digite um email"});
    if (!senha) return res.status(400).json({message: "Por favor digite uma senha"});
    if (!verificarSenha) return res.status(400).json({message: "Por favor verifique a senha"});
    if (senha !== verificarSenha) return res.status(400).json({message: "A senha digitada não corresponde a mesma da verificação"});
    
    try {
        await usuario.create({nome, email, senha});
        res.status(201).json({message: "Usuário criado com sucesso!", user: await usuario.findAll({where: {email}})})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
export const deletarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuarioFiltrado = await usuario.findByPk(id);
        if (!usuarioFiltrado) return res.status(404).json({message: "Usuario não encontrado!"})
        await usuarioFiltrado.destroy()
        return res.status(204).json({message: "usuario apagado com sucesso!"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};