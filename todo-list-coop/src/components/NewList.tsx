import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/NewList.css";

const NewList: React.FC = () => {
  const [nome, setNome] = useState<string>("");
  const navigate = useNavigate();

  const criarLista = async () => {
    if (!nome.trim()) {
      alert("O nome da lista não pode estar vazio!");
      return;
    }
    
    try {
      const response = await api.post("/listas", { nome });
      const { codigo } = response.data;
      navigate(`/lista/${codigo}`);
    } catch (error) {
      alert("Erro ao criar lista.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      criarLista();
    }
  };

  return (
    <div className="container">
      <h1>Criar Nova Lista</h1>
      <input
        type="text"
        placeholder="Nome da Lista"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={criarLista}>Criar</button>
    </div>
  );
};

export default NewList;
