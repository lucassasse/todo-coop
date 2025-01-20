import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => navigate("/nova-lista")}>Criar Nova Lista</button>
      <button onClick={() => navigate("/entrar-lista")}>Entrar em Lista Existente</button>
    </div>
  );
};

export default Home;
