import {
  listarcategoria,
  listarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController.js";
import { Router } from "express";

const router = Router();

router.get("/listar", listarcategoria);
router.get("/listar/:id", listarCategoriaPorId);
router.post("/criar", criarCategoria);
router.put("/atualizar/:id", atualizarCategoria);
router.delete("/deletar/:id", deletarCategoria);

export default router;