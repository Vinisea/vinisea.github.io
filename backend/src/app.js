import "./models/index.js";
import express from "express";
import cors from "cors";

//importar rotas
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());

//ROTAS - ENDPOINTS
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada :(" });
});

export default app;