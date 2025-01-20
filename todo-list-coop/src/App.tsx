import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NewList from "./components/NewList";
import JoinList from "./components/JoinList";
import TodoList from "./components/TodoList";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nova-lista" element={<NewList />} />
        <Route path="/entrar-lista" element={<JoinList />} />
        <Route path="/lista/:codigo" element={<TodoList />} />
      </Routes>
    </Router>
  );
};

export default App;
