import express from "express";
import { createList, getList, addTask, getTasks, updateTaskStatus, deleteTask } from "../controllers/listController";
import { Server } from "socket.io";

export default (io: Server) => {
  const router = express.Router();

  // Criar uma nova lista
  router.post("/listas", createList);

  // Obter informações de uma lista pelo código
  router.get("/listas/:codigo", getList);

  // Adicionar uma nova tarefa a uma lista
  router.post("/listas/:codigo/tarefas", addTask(io));

  // Obter todas as tarefas de uma lista
  router.get("/listas/:codigo/tarefas", getTasks);

  // Atualizar o status de uma tarefa
  router.put("/listas/:codigo/tarefas/:id", updateTaskStatus(io));

  // Deletar uma tarefa
  router.delete("/listas/:codigo/tarefas/:id", deleteTask(io));

  return router;
};
