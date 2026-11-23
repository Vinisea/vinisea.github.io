import {
  listarAtividades,
  listarAtividadePorId,
  cadastrarAtividade,
  atualizarAtividade,
  deletarAtividade,
} from "../controllers/atividadeController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { uploadImagem, tratarErroUpload } from "../middlewares/uploadMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/listar", listarAtividades);
router.get("/listar/:id", listarAtividadePorId);
router.post("/cadastrar", autenticar, uploadImagem, tratarErroUpload, cadastrarAtividade);
router.put("/atualizar/:id", autenticar, uploadImagem, tratarErroUpload, atualizarAtividade);
router.delete("/deletar/:id", autenticar, deletarAtividade);

export default router;