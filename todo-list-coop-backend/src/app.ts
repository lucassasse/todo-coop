import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import listRoutes from "./routes/listRoutes";

const app = express();

// Configuração do CORS
app.use(
  cors({
    origin: "http://localhost:5173", // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Cabeçalhos permitidos
  })
);

// Middleware para interpretar JSON
app.use(express.json());

// Função para configurar as rotas com `io`
export const configureRoutes = (io: Server) => {
  app.use(listRoutes(io));
};

export default app;
