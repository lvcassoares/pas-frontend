import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RegisterPage = () => {
  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2>Cadastro</h2>
      <p>Você deseja se cadastrar como?</p>
      <div>
        <Link to="/register/student" className="btn btn-primary">Aluno</Link>
        <Link to="/register/teacher" className="btn btn-secondary">Professor</Link>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
        Cadastros de funcionários e gerentes são realizados internamente.
      </p>
    </div>
  );
};

export default RegisterPage;