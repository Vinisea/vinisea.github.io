import {
  listarUsuario,
  criarUsuario,
  deletarUsuario,
} from "../controllers/userController.js";
import { Router } from "express";

const router = Router();

router.get("/lista", listarUsuario);
router.post("/cadastrar", criarUsuario);
router.delete("/deletar/:id", deletarUsuario);

export default router;