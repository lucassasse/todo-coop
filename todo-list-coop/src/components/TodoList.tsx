import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import { Task } from "../types/list";
import "../styles/TodoList.css";

const TodoList: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [novaTarefa, setNovaTarefa] = useState<string>("");

  const carregarTarefas = async () => {
    try {
      const response = await api.get(`/listas/${codigo}/tarefas`);
      setTarefas(response.data);
    } catch (error) {
      alert("Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    carregarTarefas();
    socket.emit("join_list", codigo);
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
      setNovaTarefa("");
    } catch (err) {
      alert("Erro ao adicionar tarefa");
    }
  };

  const alternarStatusTarefa = async (id: number) => {
    try {
      await api.put(`/listas/${codigo}/tarefas/${id}`);
    } catch (error) {
      alert("Erro ao atualizar tarefa");
    }
  };

  const deletarTarefa = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    try {
      await api.delete(`/listas/${codigo}/tarefas/${id}`);
    } catch (error) {
      alert("Erro ao excluir tarefa");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        adicionarTarefa();
      }
    };

  return (
    <div className="container">
      <h1>Lista de Tarefas ({codigo})</h1>

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} style={{ opacity: tarefa.status ? 0.5 : 1 }}>
            <input
              type="checkbox"
              checked={tarefa.status}
              onChange={() => alternarStatusTarefa(tarefa.id)}
            />
            {tarefa.descricao}
            <button className="buttonDelete" onClick={() => deletarTarefa(tarefa.id)}>
              X
            </button>
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Digite uma nova tarefa"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="buttonAdd" onClick={adicionarTarefa}>Adicionar</button>
      </div>
    </div>
  );
};

export default TodoList;