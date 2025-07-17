import React, { useState } from 'react';
import '../App.css';
import Dashboard from './Dashboard';

const DashboardFuncionario = () => {
  const [view, setView] = useState('registerStudent'); // 'registerStudent' ou 'registerTeacher'

  const handleRegister = (type) => {
    // Lógica de simulação de cadastro
    alert(`(Simulação) Formulário de ${type} enviado com sucesso!`);
  }

  return (
    <div className="container">
      <h2>Painel do Funcionário</h2>
      <p>Use os formulários abaixo para cadastrar novos alunos e professores no sistema.</p>
      
      <div>
        <button onClick={() => setView('registerStudent')} className={`btn ${view === 'registerStudent' ? 'btn-primary' : 'btn-secondary'}`}>
          Cadastrar Aluno
        </button>
        <button onClick={() => setView('registerTeacher')} className={`btn ${view === 'registerTeacher' ? 'btn-primary' : 'btn-secondary'}`}>
          Cadastrar Professor
        </button>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {view === 'registerStudent' && (
        <div>
          <h3>Novo Aluno</h3>
          <form onSubmit={() => handleRegister('aluno')}>
            <div className="form-group">
              <label>Nome Completo do Aluno:</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Email do Aluno:</label>
              <input type="email" required />
            </div>
            <div className="form-group">
              <label>Turma Inicial:</label>
              <input type="text" placeholder="Ex: Turma 101" required />
            </div>
            <button type="submit" className="btn btn-primary">Cadastrar Aluno</button>
          </form>
        </div>
      )}

      {view === 'registerTeacher' && (
        <div>
          <h3>Novo Professor</h3>
          <form onSubmit={() => handleRegister('professor')}>
            <div className="form-group">
              <label>Nome Completo do Professor:</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Email do Professor:</label>
              <input type="email" required />
            </div>
            <div className="form-group">
              <label>Especialidade:</label>
              <input type="text" placeholder="Ex: Matemática" required />
            </div>
            <button type="submit" className="btn btn-primary">Cadastrar Professor</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardFuncionario;