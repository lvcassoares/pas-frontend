import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to={user ? "/dashboard" : "/"}>Portal Educacional</Link>
      <div>
        {user ? (
          <>
            <span>Bem-vindo, {user.name}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
          </>
        ) : (
          <span></span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;