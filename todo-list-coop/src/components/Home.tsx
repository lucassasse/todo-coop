import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="button-container">
        <button onClick={() => navigate("/nova-lista")}>Criar Nova Lista</button>
        <button onClick={() => navigate("/entrar-lista")}>Entrar em Lista Existente</button>
      </div>
    </div>
  );
};

export default Home;
