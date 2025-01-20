import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  return (
    <div>
      <h1>Entrar em Lista Existente</h1>
      <input
        type="text"
        placeholder="Código da Lista"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button onClick={entrarLista}>Entrar</button>
    </div>
  );
};

export default JoinList;
