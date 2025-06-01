import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5002/api/usuarios');
      if (!response.ok) {
        return { success: false, message: 'Erro ao buscar usuários' };
      }
      const data = await response.json();
      const usuarios = data.usuarios || [];
      const foundUser = usuarios.find(
        (u) => u.nomeUsuario.toLowerCase() === username.toLowerCase() && u.senha === password
      );
      if (foundUser) {
        if (foundUser.statusUsuario !== 'Ativo') {
          return { success: false, message: 'Usuário inativo' };
        }
        setIsAuthenticated(true);
        setUser(foundUser);
        return { success: true };
      }
      return { success: false, message: 'Usuário ou senha inválidos' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro no login' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider };
