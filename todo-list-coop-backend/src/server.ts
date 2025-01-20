import app, { configureRoutes } from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Configuração do servidor HTTP e WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // URL do frontend
  },
});

// Configurar rotas com `io`
configureRoutes(io);

// Evento WebSocket
io.on("connection", (socket) => {
  console.log("Novo cliente conectado!");

  socket.on("join_list", (codigo) => {
    socket.join(codigo);
    console.log(`Cliente entrou na lista: ${codigo}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado.");
  });
});

// Iniciar o servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
