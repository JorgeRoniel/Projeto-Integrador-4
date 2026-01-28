import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Confirmacao from "./pages/Confirmacao";
import Catalogo from "./pages/Catalogo";
import ListaDesejo from "./pages/ListaDesejo";
import MeusLivros from "./pages/MeusLivros";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import DetalhesLivro from "./pages/DetalhesLivro";

function AppRoutes({
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
  livros,
}) {
  return (
    <Routes>
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
        path="/catalogo"
        element={
          <Catalogo
            livros={livros}
            onAddWishlist={adicionarAListaDesejo}
            onAddMeusLivros={adicionarAMeusLivros}
            wishlist={wishlist}
            meusLivros={meusLivros}
          />
        }
      />
      <Route
        path="/livro/:id"
        element={
          <DetalhesLivro
            livros={livros}
            onAddWishlist={adicionarAListaDesejo}
            onAddMeusLivros={adicionarAMeusLivros}
            meusLivros={meusLivros}
          />
        }
      />
      <Route
        path="/lista-desejo"
        element={
          <ListaDesejo
            wishlist={wishlist}
            onRemove={removerDaListaDesejo}
            onMoverParaMeusLivros={moverParaMeusLivros}
          />
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/meus-livros"
        element={
          <MeusLivros
            meusLivros={meusLivros}
            setMeusLivros={setMeusLivros}
            atualizarAvaliacaoLivro={atualizarAvaliacaoLivro}
          />
        }
      />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/admin" element={<Admin />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
