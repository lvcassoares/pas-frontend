import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Para simulação
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- SIMULAÇÃO DE LOGIN ---
    // No mundo real, você faria uma chamada para a API aqui
    // A API retornaria os dados do usuário, incluindo seu perfil (role)
    
    let userName = '';
    switch(role) {
        case 'student': userName = 'João Aluno'; break;
        case 'teacher': userName = 'Maria Professora'; break;
        case 'employee': userName = 'Carlos Funcionário'; break;
        case 'manager': userName = 'Ana Gerente'; break;
        default: userName = 'Usuário';
    }

    const userData = {
      name: userName,
      email: email,
      role: role,
    };
    
    login(userData); // Atualiza o contexto de autenticação
    navigate('/dashboard'); // Redireciona para o dashboard
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {/* Este seletor é apenas para fins de simulação */}
        <div className="form-group">
            <label>Logar como:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
                <option value="employee">Funcionário</option>
                <option value="manager">Gerente</option>
            </select>
        </div>

        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;