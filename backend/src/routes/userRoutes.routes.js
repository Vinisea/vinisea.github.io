import {
  listarUsuario,
  criarUsuario,
  autenticarUsuario,
  deletarUsuario,
} from "../controllers/userController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/lista", autenticar, listarUsuario);
router.post("/cadastrar", criarUsuario);
router.post("/login", autenticarUsuario);
router.delete("/deletar/:id", autenticar, deletarUsuario);

export default router;