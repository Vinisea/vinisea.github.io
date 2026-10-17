import {
  listarcategoria,
  listarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController.js";
import { Router } from "express";

const router = Router();

router.get("/categoria", listarcategoria);
router.get("/categoria/:id", listarCategoriaPorId);
router.post("/categoria", criarCategoria);
router.put("/categoria/:id", atualizarCategoria);
router.delete("/categoria/:id", deletarCategoria);

export default router;