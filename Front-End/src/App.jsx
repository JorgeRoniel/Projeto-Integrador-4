import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import logoEscura from "./assets/logo-branco.png";
import logoClara from "./assets/logo-roxa.png";

import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";
import { listBooks } from "./services/api";

function App() {
  const location = useLocation();

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
        const data = await listBooks(0, 50); // Busca os primeiros 50 livros
        // Se a API retornar uma estrutura de Page do Spring, os dados estão em data.content
        setLivros(data.content || data || []);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
        toast.error("Não foi possível carregar o catálogo de livros.");
      } finally {
        setIsLoadingBooks(false);
      }
    }
    loadBooks();
  }, []);

  // Função para adicionar um livro à lista de desejos (evitando duplicatas)
  const adicionarAListaDesejo = (livro) => {
    if (meusLivros.find((item) => item.id === livro.id)) {
      toast.error("Este livro já está em Meus Livros!", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }
    if (!wishlist.find((item) => item.id === livro.id)) {
      setWishlist([...wishlist, livro]);
      toast.success(`"${livro.titulo}" adicionado à lista de desejos!`, {
        duration: 3000,
        position: "bottom-right",
      });
    } else {
      toast.error("Este livro já está na sua lista de desejos!", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  // Função para remover um livro da lista de desejo
  const removerDaListaDesejo = (id) => {
    setWishlist(wishlist.filter((livro) => livro.id !== id));
  };

  // Função para adicionar um livro a "Meus Livros" (evitando duplicatas)
  const adicionarAMeusLivros = (livro) => {
    if (!meusLivros.find((item) => item.id === livro.id)) {
      const livroComAvaliacao = { ...livro, avaliacao: null };
      setMeusLivros([...meusLivros, livroComAvaliacao]);
      toast.success(`"${livro.titulo}" adicionado a Meus Livros!`, {
        duration: 3000,
        position: "bottom-right",
      });
    } else {
      toast.error("Este livro já está em Meus Livros!", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  // Função para mover livro da lista de desejos para "Meus Livros"
  const moverParaMeusLivros = (livro) => {
    if (!meusLivros.find((item) => item.id === livro.id)) {
      const livroComAvaliacao = { ...livro, avaliacao: null };
      setMeusLivros([...meusLivros, livroComAvaliacao]);
      setWishlist(wishlist.filter((item) => item.id !== livro.id));
      toast.success(`"${livro.titulo}" movido para Meus Livros!`, {
        duration: 3000,
        position: "bottom-right",
      });
    } else {
      toast.error("Este livro já está em Meus Livros!", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  // Função para atualizar avaliação de um livro em "Meus Livros"
  const atualizarAvaliacaoLivro = (livroId, avaliacao) => {
    setMeusLivros((prevLivros) =>
      prevLivros.map((livro) =>
        livro.id === livroId ? { ...livro, avaliacao } : livro,
      ),
    );
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
