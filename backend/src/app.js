import "./models/index.js";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

//importar rotas
import routes from "./routes/index.js";

const app = express();
const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const pastaUploads = path.resolve(diretorioAtual, "../uploads");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());

app.use("/uploads", express.static(pastaUploads));

//ROTAS - ENDPOINTS
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada :(" });
});

export default app;