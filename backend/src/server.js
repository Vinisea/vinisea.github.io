import app from "./app.js";
import { conn } from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3333;

const iniciarServidor = async () => {
  try {
    await conn.authenticate();
    await conn.sync();
    app.listen(PORT, () => {
      console.log(`Servidor aberto em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Houve um erro ao iniciar o servidor:", error.message);
    process.exitCode = 1;
  }
};

iniciarServidor();