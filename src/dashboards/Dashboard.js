import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardAluno from './DashboardAluno';
import DashboardProfessor from './DashboardProfessor';
import DashboardFuncionario from './DashboardFuncionario';
import DashboardGerente from './DashboardGerente';

const Dashboard = () => {
  const { user } = useAuth();

  // Se não houver usuário logado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Renderiza o dashboard correto com base no perfil do usuário
  switch (user.role) {
    case 'student':
      return <DashboardAluno />;
    case 'teacher':
      return <DashboardProfessor />;
    case 'employee':
      return <DashboardFuncionario />;
    case 'manager':
      return <DashboardGerente />;
    default:
      // Caso haja um perfil desconhecido, volta para o login
      return <Navigate to="/login" />;
  }
};

export default Dashboard;