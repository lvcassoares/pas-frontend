import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redireciona para o dashboard específico baseado no role
  switch (user.role) {
    case "ALUNO":
      return <Navigate to="/dashboard/aluno" replace />;
    case "PROFESSOR":
      return <Navigate to="/dashboard/professor" replace />;
    case "ATENDENTE":
      return <Navigate to="/dashboard/funcionario" replace />;
    case "GERENTE":
      return <Navigate to="/dashboard/gerente" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;
