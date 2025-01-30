import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/JoinList.css";

const JoinList: React.FC = () => {
  const [codigo, setCodigo] = useState<string>("");
  const navigate = useNavigate();

  const entrarLista = async () => {
    try {
      await api.get(`/listas/${codigo}`);
      navigate(`/lista/${codigo}`);
    } catch (err) {
      alert("Código inválido!");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      entrarLista();
    }
  };

  return (
    <div className="container">
      <h1>Entrar em Lista Existente</h1>
      <input
        type="text"
        placeholder="Código da Lista"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={entrarLista}>Entrar</button>
    </div>
  );
};

export default JoinList;