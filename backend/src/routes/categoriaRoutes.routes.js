import {
  listarcategoria,
  listarCategoriaPorId,
  cadastrarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/listar", listarcategoria);
router.get("/listar/:id", listarCategoriaPorId);
router.post("/cadastrar", autenticar, cadastrarCategoria);
router.put("/atualizar/:id", autenticar, atualizarCategoria);
router.delete("/deletar/:id", autenticar, deletarCategoria);

export default router;