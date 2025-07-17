import React from 'react';
import '../App.css';
import Dashboard from './Dashboard';

// Dados fictícios para o relatório
const reportData = {
  totalStudents: 587,
  totalTeachers: 42,
  averageGrade: 8.2,
  enrollmentsThisMonth: 34,
};

const DashboardGerente = () => {
  return (
    <div className="container">
      <h2>Painel do Gerente - Relatório Geral</h2>
      <p>Visão geral dos dados da instituição.</p>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, margin: '10px', textAlign: 'center' }}>
          <h3>Total de Alunos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reportData.totalStudents}</p>
        </div>
        <div className="card" style={{ flex: 1, margin: '10px', textAlign: 'center' }}>
          <h3>Total de Professores</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reportData.totalTeachers}</p>
        </div>
        <div className="card" style={{ flex: 1, margin: '10px', textAlign: 'center' }}>
          <h3>Média Geral de Notas</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reportData.averageGrade.toFixed(1)}</p>
        </div>
        <div className="card" style={{ flex: 1, margin: '10px', textAlign: 'center' }}>
          <h3>Matrículas este Mês</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{reportData.enrollmentsThisMonth}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Desempenho por Turma (Placeholder)</h3>
        <div style={{
          height: '200px',
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa'
        }}>
          [ Placeholder para Gráfico de Barras ]
        </div>
      </div>
    </div>
  );
};

export default DashboardGerente;