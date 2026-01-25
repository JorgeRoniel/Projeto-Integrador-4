import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import logoEscura from "./assets/logo-branco.png";
import logoClara from "./assets/logo-roxa.png";

import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";

// Base de dados mockada de livros
const LIVROS_DISPONIVEIS = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    cor: "bg-zinc-900",
  },
  {
    id: 2,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    cor: "bg-emerald-900",
  },
  { id: 3, titulo: "1984", autor: "George Orwell", cor: "bg-amber-900" },
  {
    id: 4,
    titulo: "O Pequeno Príncipe",
    autor: "A. Saint-Exupéry",
    cor: "bg-blue-900",
  },
  { id: 5, titulo: "Harry Potter", autor: "J.K. Rowling", cor: "bg-red-900" },
  {
    id: 6,
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    cor: "bg-gray-800",
  },
  {
    id: 7,
    titulo: "A Culpa é das Estrelas",
    autor: "John Green",
    cor: "bg-cyan-800",
  },
];

function App() {
  const location = useLocation();

  //Armazenamos os livros adicionados na lista de desejo
  const [wishlist, setWishlist] = useState([]);

  //Função para adicionar um livro à lista (evitando duplicatas)
  const adicionarALista = (livro) => {
    if (!wishlist.find((item) => item.id === livro.id)) {
      setWishlist([...wishlist, livro]);
      toast.success(`"${livro.titulo}" adicionado à lista!`, {
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

  //Função para remover um livro da lista de desejo
  const removerDaLista = (id) => {
    setWishlist(wishlist.filter((livro) => livro.id !== id));
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

      {/*Tela que você vai após o login */}
      {isAppView && (
        <div className="flex w-full h-screen overflow-hidden animate-in fade-in">
          <Sidebar logoClara={logoClara} />

          <main className="flex-1 h-screen overflow-y-auto p-10 bg-white">
            {/*A barra de busca no topo da página*/}
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
              adicionarALista={adicionarALista}
              removerDaLista={removerDaLista}
              logoEscura={logoEscura}
              logoClara={logoClara}
              livros={LIVROS_DISPONIVEIS}
            />
          </main>
        </div>
      )}

      {!isAppView && (
        <AppRoutes
          wishlist={wishlist}
          setWishlist={setWishlist}
          adicionarALista={adicionarALista}
          removerDaLista={removerDaLista}
          logoEscura={logoEscura}
          logoClara={logoClara}
          livros={LIVROS_DISPONIVEIS}
        />
      )}
    </div>
  );
}

export default App;
