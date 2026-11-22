import { Router } from "express";

import categoriaRoutes from "./categoriaRoutes.routes.js"
import atividadeRoutes from "./atividadeRoutes.routes.js";
import userRoutes from "./userRoutes.routes.js"

const router = Router()

router.use("/categoria", categoriaRoutes);
router.use("/atividade", atividadeRoutes);
router.use("/user", userRoutes);

export default router;