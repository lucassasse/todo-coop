import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import { Task } from "../types/list";

const TodoList: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [novaTarefa, setNovaTarefa] = useState<string>("");

  // Função para carregar as tarefas do banco
  const carregarTarefas = async () => {
    try {
      const response = await api.get(`/listas/${codigo}/tarefas`);
      setTarefas(response.data);
    } catch (error) {
      alert("Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    // Carregar tarefas do backend
    carregarTarefas();

    // Conectar ao WebSocket
    socket.emit("join_list", codigo);

    // Escutar atualizações da lista
    socket.on("update_list", (tarefasAtualizadas) => {
      setTarefas(tarefasAtualizadas);
    });

    return () => {
      socket.off("update_list");
    };
  }, [codigo]);

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) {
      alert("A tarefa não pode estar vazia!");
      return;
    }

    try {
      await api.post(`/listas/${codigo}/tarefas`, {
        descricao: novaTarefa,
      });

      setNovaTarefa(""); // Limpar o campo de entrada
    } catch (err) {
      alert("Erro ao adicionar tarefa");
    }
  };

  return (
    <div>
      <h1>Lista de Tarefas ({codigo})</h1>

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>
            {tarefa.descricao} - {tarefa.status ? "Feita" : "Pendente"}
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Digite uma nova tarefa"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>
    </div>
  );
};

export default TodoList;
