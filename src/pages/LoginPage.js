import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("aluno"); // 'aluno', 'professor' ou 'funcionario'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Define o endpoint baseado no tipo de usuário selecionado
      const endpoint = `http://localhost:8080/${userType}/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas ou usuário não encontrado");
      }

      const data = await response.json();
      const token = data.token;

      // Decodifica o token para pegar as informações
      const payload = JSON.parse(atob(token.split(".")[1]));

      const userData = {
        token,
        id: payload.id,
        email: payload.sub,
        role: payload.role.toUpperCase(), // Padroniza para maiúsculas
      };

      login(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de Usuário:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="form-control"
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="funcionario">Funcionário</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
