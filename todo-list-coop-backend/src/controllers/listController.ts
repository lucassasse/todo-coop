import { Request, Response } from "express";
import pool from "../models/db";
import { v4 as uuidv4 } from "uuid";
import { Server } from "socket.io";

export const createList = async (req: Request, res: Response) => {
  const { nome } = req.body;

  const codigo = uuidv4().slice(0, 5).toUpperCase(); // Gerar código único de 5 caracteres

  try {
    const result = await pool.query(
      "INSERT INTO listas (codigo, nome) VALUES ($1, $2) RETURNING *",
      [codigo, nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar a lista" + err });
  }
};

export const getList = async (req: Request, res: Response) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query("SELECT * FROM listas WHERE codigo = $1", [
      codigo,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Lista não encontrada" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar a lista" });
  }
};

export const addTask = (io: Server) => {
  return async (req: Request, res: Response): Promise<void> => {
    const { codigo } = req.params;
    const { descricao } = req.body;

    try {
      const lista = await pool.query("SELECT id FROM listas WHERE codigo = $1", [
        codigo,
      ]);

      if (lista.rows.length === 0) {
        res.status(404).json({ error: "Lista não encontrada" });
        return;
      }

      const listaId = lista.rows[0].id;

      const result = await pool.query(
        "INSERT INTO tarefas (descricao, lista_id) VALUES ($1, $2) RETURNING *",
        [descricao, listaId]
      );

      const novaTarefa = result.rows[0];

      // Emitir atualização para todos os clientes na lista
      const tarefasAtualizadas = await pool.query(
        "SELECT id, descricao, status FROM tarefas WHERE lista_id = $1",
        [listaId]
      );

      io.to(codigo).emit("update_list", tarefasAtualizadas.rows);

      res.status(201).json(novaTarefa);
    } catch (err) {
      res.status(500).json({ error: "Erro ao adicionar tarefa" });
    }
  };
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { codigo } = req.params;

  try {
    const lista = await pool.query("SELECT id FROM listas WHERE codigo = $1", [
      codigo,
    ]);

    if (lista.rows.length === 0) {
      res.status(404).json({ error: "Lista não encontrada" });
      return;
    }

    const listaId = lista.rows[0].id;

    const tarefas = await pool.query(
      "SELECT id, descricao, status FROM tarefas WHERE lista_id = $1",
      [listaId]
    );

    res.json(tarefas.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

export const updateTaskStatus = (io: Server) => {
  return async (req: Request, res: Response): Promise<void> => {
    const { codigo, id } = req.params;

    try {
      // Verifica se a tarefa existe
      const tarefa = await pool.query(
        "SELECT id, lista_id, status FROM tarefas WHERE id = $1",
        [id]
      );

      if (tarefa.rows.length === 0) {
        res.status(404).json({ error: "Tarefa não encontrada" });
        return;
      }

      const novoStatus = !tarefa.rows[0].status; // Inverte o status atual

      // Atualiza o status da tarefa
      await pool.query("UPDATE tarefas SET status = $1 WHERE id = $2", [
        novoStatus,
        id,
      ]);

      // Busca a lista atualizada de tarefas
      const listaId = tarefa.rows[0].lista_id;
      const tarefasAtualizadas = await pool.query(
        "SELECT id, descricao, status FROM tarefas WHERE lista_id = $1 ORDER BY status ASC, id ASC",
        [listaId]
      );

      // Notifica todos os clientes conectados a essa lista
      io.to(codigo).emit("update_list", tarefasAtualizadas.rows);

      res.status(200).json({ message: "Tarefa atualizada com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
  };
};

export const deleteTask = (io: Server) => {
  return async (req: Request, res: Response): Promise<void> => {
    const { codigo, id } = req.params;

    try {
      // Verifica se a tarefa existe
      const tarefa = await pool.query("SELECT lista_id FROM tarefas WHERE id = $1", [id]);

      if (tarefa.rows.length === 0) {
        res.status(404).json({ error: "Tarefa não encontrada" });
        return;
      }

      const listaId = tarefa.rows[0].lista_id;

      // Exclui a tarefa do banco de dados
      await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);

      // Busca a lista atualizada de tarefas
      const tarefasAtualizadas = await pool.query(
        "SELECT id, descricao, status FROM tarefas WHERE lista_id = $1 ORDER BY status ASC, id ASC",
        [listaId]
      );

      // Notifica todos os clientes conectados a essa lista
      io.to(codigo).emit("update_list", tarefasAtualizadas.rows);

      res.status(200).json({ message: "Tarefa excluída com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
  };
};