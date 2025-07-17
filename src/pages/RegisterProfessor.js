import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RegisterProfessor = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui iria a lógica de chamada à API para cadastrar
    alert('Professor cadastrado com sucesso! (Simulação)');
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Cadastro de Professor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome Completo:</label>
          <input type="text" required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" required />
        </div>
        <div className="form-group">
          <label>Especialidade (Ex: Matemática, Português):</label>
          <input type="text" required />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input type="password" required />
        </div>
        <button type="submit" className="btn btn-primary">Cadastrar</button>
      </form>
    </div>
  );
};

export default RegisterProfessor;