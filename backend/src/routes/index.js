import { Router } from "express";

import categoriaRoutes from "./categoriaRoutes.routes.js"
// import atividadeRoutes from "./atividadeRoutes.routes.js" -> mudar qunado tiver com as rotas prontas
// import userRoutes from "./userRoutes.routes.js" -> mudar qunado tiver com as rotas prontas

const router = Router()

router.use("/categoria", categoriaRoutes);
// router.use("/atividade", atividadeRoutes); -> mudar qunado tiver com as rotas prontas
// router.use("/user", userRoutes); -> mudar qunado tiver com as rotas prontas

export default router;