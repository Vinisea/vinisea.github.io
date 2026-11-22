import {
  listarAtividades,
  listarAtividadePorId,
  cadastrarAtividade,
  atualizarAtividade,
  deletarAtividade,
} from "../controllers/atividadeController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/listar", listarAtividades);
router.get("/listar/:id", listarAtividadePorId);
router.post("/cadastrar", autenticar, cadastrarAtividade);
router.put("/atualizar/:id", autenticar, atualizarAtividade);
router.delete("/deletar/:id", autenticar, deletarAtividade);

export default router;