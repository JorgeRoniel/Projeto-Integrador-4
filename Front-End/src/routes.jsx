import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Confirmacao from './pages/Confirmacao';
import Catalogo from './pages/Catalogo';
import ListaDesejo from './pages/ListaDesejo';
import MeusLivros from './pages/MeusLivros';


function AppRoutes({
    wishlist, setWishlist, adicionarALista, removerDaLista, logoEscura, logoClara, livros
}) {
    return (
        <Routes>
            <Route path='/login' element={<Login logoEscura={logoEscura} logoClara={logoClara} />} />
            <Route path='/cadastro' element={<Cadastro logoEscura={logoEscura} logoClara={logoClara} />} />
            <Route path='/recuperar-senha' element={<RecuperarSenha logoEscura={logoEscura} />} />
            <Route path='/confirmacao' element={<Confirmacao />} />

            <Route path="/catalogo" element={<Catalogo livros={livros} onAdd={adicionarALista} />} />
            <Route path="/lista-desejo" element={<ListaDesejo wishlist={wishlist} onRemove={removerDaLista} />} />
            <Route path="/dashboard" element={<div className="p-10 text-center font-bold">Página em construção...</div>} />
            <Route path="/meus-livros" element={<MeusLivros />} />

            <Route path='/' element={<Navigate to='/login' replace />} />

            <Route path='*' element={<Navigate to='/login' replace />} />

        </Routes>
    );
}

export default AppRoutes;