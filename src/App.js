import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterAluno from "./pages/RegisterAluno";
import RegisterProfessor from "./pages/RegisterProfessor";
import ProtectedRoute from "./components/ProtectedRoute"; // Novo componente
import Dashboard from "./dashboards/Dashboard";
import DashboardAluno from "./dashboards/DashboardAluno";
import DashboardProfessor from "./dashboards/DashboardProfessor";
import DashboardFuncionario from "./dashboards/DashboardFuncionario";
import DashboardGerente from "./dashboards/DashboardGerente";

import "./App.css";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/student" element={<RegisterAluno />} />
          <Route path="/register/teacher" element={<RegisterProfessor />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/aluno" element={<DashboardAluno />} />
            <Route
              path="/dashboard/professor"
              element={<DashboardProfessor />}
            />
            <Route
              path="/dashboard/funcionario"
              element={<DashboardFuncionario />}
            />
            <Route path="/dashboard/gerente" element={<DashboardGerente />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
