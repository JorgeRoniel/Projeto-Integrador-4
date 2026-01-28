import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";


import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Confirmacao from "./pages/Confirmacao";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import MeusLivros from "./pages/MeusLivros";
import ListaDesejo from "./pages/ListaDesejo";
import Perfil from "./pages/Perfil";
import DetalhesLivro from "./pages/DetalhesLivro";


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRoutes = ({
  livros,
  wishlist,
  setWishlist,
  adicionarAListaDesejo,
  removerDaListaDesejo,
  meusLivros,
  setMeusLivros,
  adicionarAMeusLivros,
  moverParaMeusLivros,
  atualizarAvaliacaoLivro,
  logoEscura,
  logoClara,
}) => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={<Login logoEscura={logoEscura} logoClara={logoClara} />}
      />
      <Route
        path="/cadastro"
        element={<Cadastro logoEscura={logoEscura} logoClara={logoClara} />}
      />
      <Route
        path="/recuperar-senha"
        element={<RecuperarSenha logoEscura={logoEscura} />}
      />
      <Route path="/confirmacao" element={<Confirmacao />} />

      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/catalogo"
        element={
          <PrivateRoute>
            <Catalogo
              livros={livros}
              onAddWishlist={adicionarAListaDesejo}
              onAddMeusLivros={adicionarAMeusLivros}
              wishlist={wishlist}
              meusLivros={meusLivros}
            />
          </PrivateRoute>
        }
      />

      
      <Route
        path="/livro/:id"
        element={
          <PrivateRoute>
            <DetalhesLivro
              livros={livros}
              onAddWishlist={adicionarAListaDesejo}
              onAddMeusLivros={adicionarAMeusLivros}
              wishlist={wishlist}
              meusLivros={meusLivros}
            />
          </PrivateRoute>
        }
      />
      

      <Route
        path="/meus-livros"
        element={
          <PrivateRoute>
            <MeusLivros
              meusLivros={meusLivros}
              setMeusLivros={setMeusLivros}
              atualizarAvaliacaoLivro={atualizarAvaliacaoLivro}
            />
          </PrivateRoute>
        }
      />
      <Route
        path="/lista-desejo"
        element={
          <PrivateRoute>
            <ListaDesejo
              wishlist={wishlist}
              onRemove={removerDaListaDesejo}
              onMoverParaMeusLivros={moverParaMeusLivros}
            />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;