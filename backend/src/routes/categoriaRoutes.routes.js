import {
  listarcategoria,
  listarCategoriaPorId,
  cadastrarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController.js";
import { Router } from "express";

const router = Router();

router.get("/listar", listarcategoria);
router.get("/listar/:id", listarCategoriaPorId);
router.post("/cadastrar", cadastrarCategoria);
router.put("/atualizar/:id", atualizarCategoria);
router.delete("/deletar/:id", deletarCategoria);

export default router;