import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const HomePage = () => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center' }}>
        <h1>Bem-vindo ao Portal Educacional</h1>
        <p>A sua plataforma completa para gestão de aprendizado.</p>
        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;