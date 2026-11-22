import { Router } from "express";

import categoriaRoutes from "./categoriaRoutes.routes.js"
// import atividadeRoutes from "./atividadeRoutes.routes.js" -> mudar qunado tiver com as rotas prontas
import userRoutes from "./userRoutes.routes.js"

const router = Router()

router.use("/categoria", categoriaRoutes);
// router.use("/atividade", atividadeRoutes); -> mudar qunado tiver com as rotas prontas
router.use("/user", userRoutes);

export default router;