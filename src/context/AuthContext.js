import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Vamos armazenar o usuário no estado. `null` significa deslogado.
  // O objeto do usuário terá { name: '...', role: '...' }
  const [user, setUser] = useState(null);

  // Função para simular o login
  const login = (userData) => {
    setUser(userData);
  };

  // Função para simular o logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};