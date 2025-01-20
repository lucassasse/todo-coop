import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const NewList: React.FC = () => {
  const [nome, setNome] = useState<string>("");
  const navigate = useNavigate();

  const criarLista = async () => {
    const response = await api.post("/listas", { nome });
    const { codigo } = response.data;
    navigate(`/lista/${codigo}`);
  };

  return (
    <div>
      <h1>Criar Nova Lista</h1>
      <input
        type="text"
        placeholder="Nome da Lista"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={criarLista}>Criar</button>
    </div>
  );
};

export default NewList;
