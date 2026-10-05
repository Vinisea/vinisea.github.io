import "./models/index.js";
import express from "express";
import cors from "cors";
import { conn } from "./config/database.js";

//importar rotas
import tarefasRoutes from "./routes/tarefasRoutes.route.js"

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());

//Conexão com o banco de dados
conn
  .sync()
  .then()
  .catch((error) => console.log(error.message));

//ROTAS - ENDPOINTS
app.use("/tarefas", tarefasRoutes);

app.use((req, res) => {
    res.status(404).json({message: "Rota não encontrada :("})
})

export default app;