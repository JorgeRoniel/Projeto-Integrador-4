import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import ResetPassword from "./pages/ResetPassword";
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
  handleToggleNotification,
  highlights,
  Recomendation,
  listBooks,
  refreshCatalogo,
  cacheBusca,
  setCacheBusca,
  handleDeletarLivro
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

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/catalogo"
        element={
          <Catalogo
            highlights={highlights}
            Recomendation={Recomendation}
            listBooks={listBooks}
            onAddWishlist={adicionarAListaDesejo}
            onAddMeusLivros={adicionarAMeusLivros}
            wishlist={wishlist}
            meusLivros={meusLivros}
            cacheBusca={cacheBusca}
            setCacheBusca={setCacheBusca}
          />
        }
      />
      <Route
        path="/livro/:id"
        element={
          <DetalhesLivro
            wishlist={wishlist}
            onAddWishlist={adicionarAListaDesejo}
            onAddMeusLivros={adicionarAMeusLivros}
            meusLivros={meusLivros}
            handleDeletarLivro={handleDeletarLivro}
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
            onToggleNotification={handleToggleNotification}
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
      <Route
      path="/admin"
      element={<Admin onBookAdded={refreshCatalogo} />}
      />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
