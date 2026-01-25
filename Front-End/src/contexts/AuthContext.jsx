import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../services/api";

// Criação do contexto
const AuthContext = createContext(null);

// Chaves do localStorage
const STORAGE_KEYS = {
  USER: "library_user",
  TOKEN: "token",
};

// Provider do contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
        // Limpa dados corrompidos
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }

    setLoading(false);
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      const response = await apiLogin(email, senha);

      // Estrutura do usuário baseada no ReturnLoginDTO
      const userData = {
        id: response.user_id,
        username: response.username,
        nome: response.nome,
        email: response.email,
        telefone: response.telefone,
        foto: response.foto,
        role: response.role, // "ADMIN" ou "USER"
      };

      // Salva no localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      // Atualiza o estado
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  };

  // Função de cadastro
  const register = async (dados) => {
    try {
      await apiRegister({
        username: dados.usuario,
        nome: `${dados.nome} ${dados.sobrenome}`,
        email: dados.email,
        senha: dados.senha,
        telefone: dados.telefone,
        role: "USER", // Novos usuários sempre são USER
      });

      return { success: true };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return {
        success: false,
        error: error.message || "Erro ao fazer cadastro",
      };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  // Verifica se o usuário é admin
  const isAdmin = () => {
    return user?.role === "ADMIN";
  };

  // Verifica se está autenticado
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  };

  // Atualiza dados do usuário
  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export default AuthContext;
