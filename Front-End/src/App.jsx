import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import logoEscura from "./assets/logo-branco.png";
import logoClara from "./assets/logo-roxa.png";

import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";
import { listBooks, addToWishlist, removeFromWishlist, getUserWishlist, rateBook, getUserRatings } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Estado para armazenar os livros reais da API
  const [livros, setLivros] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  // Armazenamos os livros adicionados na lista de desejo
  const [wishlist, setWishlist] = useState([]);

  // Armazenamos os livros em "Meus Livros"
  const [meusLivros, setMeusLivros] = useState([]);

  // Busca os livros ao montar o componente
  useEffect(() => {
    async function loadBooks() {
      try {
        setIsLoadingBooks(true);
        const data = await listBooks(0, 50);
        setLivros(data.content || data || []);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
        toast.error("Não foi possível carregar o catálogo de livros.", { id: 'error-catalog' });
      } finally {
        setIsLoadingBooks(false);
      }
    }
    loadBooks();
  }, []);

  // Busca Wishlist quando o usuário logar
  useEffect(() => {
    async function loadWishlist() {
      if (user?.id) {
        try {
          const data = await getUserWishlist(user.id);
          setWishlist(Array.isArray(data) ? data : []);
        } catch (error) {
          console.warn("[Wishlist] Lista vazia:", error);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
    loadWishlist();
  }, [user?.id]);

  // Busca Meus Livros quando o usuário logar
  useEffect(() => {
    async function loadMyBooks() {
      if (user?.id) {
        try {
          const data = await getUserRatings(user.id);
          const formatted = (data || []).map(book => ({
            ...book,
            avaliacao: book.nota || book.rating || book.media || null
          }));
          setMeusLivros(formatted);
        } catch (error) {
          console.warn("[Meus Livros] Lista vazia:", error);
          setMeusLivros([]);
        }
      } else {
        setMeusLivros([]);
      }
    }
    loadMyBooks();
  }, [user?.id]);

  // Função para adicionar um livro à lista de desejos
  const adicionarAListaDesejo = async (livro) => {
    if (!user) {
      toast.error("Faça login para adicionar à lista de desejos!");
      return;
    }

    const bookId = Number(livro.id);
    const userId = Number(user.id);

    if (meusLivros.find((item) => Number(item.id) === bookId)) {
      toast.error("Este livro já está em Meus Livros!");
      return;
    }

    if (!wishlist.find((item) => Number(item.id) === bookId)) {
      try {
        await addToWishlist(userId, bookId);
        setWishlist(prev => [...prev, livro]);
        toast.success(`"${livro.titulo}" adicionado à lista de desejos!`);
      } catch (error) {
        // Se já existe (409), atualizamos o estado local para refletir isso
        if (error.status === 409 || String(error.message).includes('409')) {
          setWishlist(prev => {
            if (!prev.find(item => Number(item.id) === bookId)) {
              return [...prev, livro];
            }
            return prev;
          });
          toast.success(`"${livro.titulo}" já está na sua lista!`);
        } else {
          toast.error("Erro ao adicionar à wishlist.");
          console.error("Erro completo:", error);
        }
      }
    } else {
      toast.error("Este livro já está na sua lista de desejos!");
    }
  };

  // Função para remover um livro da lista de desejo
  const removerDaListaDesejo = async (id) => {
    if (!user) return;
    try {
      await removeFromWishlist(Number(user.id), Number(id));
      setWishlist(prev => prev.filter((livro) => Number(livro.id) !== Number(id)));
      toast.success("Removido da lista de desejos.");
    } catch (error) {
      console.error("Erro ao remover da wishlist:", error);
      toast.error("Erro ao remover.");
    }
  };

  // Função para adicionar um livro a "Meus Livros"
  const adicionarAMeusLivros = async (livro) => {
    if (!user) {
      toast.error("Faça login para salvar seus livros!");
      return;
    }

    const bookId = Number(livro.id);
    if (!meusLivros.find((item) => Number(item.id) === bookId)) {
      try {
        await rateBook(bookId, Number(user.id), 0);
        const livroComAvaliacao = { ...livro, avaliacao: 0 };
        setMeusLivros(prev => [...prev, livroComAvaliacao]);
        toast.success(`"${livro.titulo}" adicionado a Meus Livros!`);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao adicionar a Meus Livros.");
      }
    } else {
      toast.error("Este livro já está em Meus Livros!");
    }
  };

  // Função para mover livro da lista de desejos para "Meus Livros"
  const moverParaMeusLivros = async (livro) => {
    const bookId = Number(livro.id);
    if (!meusLivros.find((item) => Number(item.id) === bookId)) {
      try {
        await rateBook(bookId, Number(user.id), 0);
        await removeFromWishlist(Number(user.id), bookId);

        const livroComAvaliacao = { ...livro, avaliacao: 0 };
        setMeusLivros(prev => [...prev, livroComAvaliacao]);
        setWishlist(prev => prev.filter((item) => Number(item.id) !== bookId));

        toast.success(`"${livro.titulo}" movido para Meus Livros!`);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao mover para Meus Livros.");
      }
    } else {
      toast.error("Este livro já está em Meus Livros!");
    }
  };

  // Função para atualizar avaliação de um livro em "Meus Livros"
  const atualizarAvaliacaoLivro = async (livroId, avaliacao, comentario = "") => {
    if (!user) return;
    const bId = Number(livroId);
    try {
      await rateBook(bId, Number(user.id), avaliacao, comentario);
      setMeusLivros((prevLivros) =>
        prevLivros.map((livro) =>
          Number(livro.id) === bId ? { ...livro, avaliacao, comentario } : livro,
        ),
      );
      toast.success("Avaliação salva com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar avaliação.");
    }
  };

  const isAppView = [
    "/dashboard",
    "/catalogo",
    "/meus-livros",
    "/lista-desejo",
    "/perfil",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-white font-sans flex overflow-hidden">
      <Toaster />

      {/* Tela que você vai após o login */}
      {isAppView && (
        <div className="flex w-full h-screen overflow-hidden animate-in fade-in">
          <Sidebar logoClara={logoClara} />

          <main className="flex-1 h-screen overflow-y-auto p-10 bg-white">
            {/* A barra de busca no topo da página */}
            <div className="max-w-5xl mx-auto relative mb-12">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquise o livro"
                className="w-full border-2 border-gray-200 rounded-full py-2 px-12 outline-none focus:border-[#001b4e]"
              />
            </div>

            <AppRoutes
              wishlist={wishlist}
              setWishlist={setWishlist}
              adicionarAListaDesejo={adicionarAListaDesejo}
              removerDaListaDesejo={removerDaListaDesejo}
              meusLivros={meusLivros}
              setMeusLivros={setMeusLivros}
              adicionarAMeusLivros={adicionarAMeusLivros}
              moverParaMeusLivros={moverParaMeusLivros}
              atualizarAvaliacaoLivro={atualizarAvaliacaoLivro}
              logoEscura={logoEscura}
              logoClara={logoClara}
              livros={livros}
            />
          </main>
        </div>
      )}

      {!isAppView && (
        <AppRoutes
          wishlist={wishlist}
          setWishlist={setWishlist}
          adicionarAListaDesejo={adicionarAListaDesejo}
          removerDaListaDesejo={removerDaListaDesejo}
          meusLivros={meusLivros}
          setMeusLivros={setMeusLivros}
          adicionarAMeusLivros={adicionarAMeusLivros}
          moverParaMeusLivros={moverParaMeusLivros}
          atualizarAvaliacaoLivro={atualizarAvaliacaoLivro}
          logoEscura={logoEscura}
          logoClara={logoClara}
          livros={livros}
        />
      )}
    </div>
  );
}

export default App;
