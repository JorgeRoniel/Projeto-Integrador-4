import React, { useState } from "react";
import { Heart, BookOpen, ChevronRight } from "lucide-react";
import BookCard from "../components/BookCard";

// Componente de Menu de Ações
const ActionMenu = ({ livro, onAddWishlist, onAddMeusLivros }) => {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex gap-2"
        onMouseEnter={() => setMenuAberto(true)}
        onMouseLeave={() => setMenuAberto(false)}
      >
        {/* Botão Lista de Desejos */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddWishlist(livro);
          }}
          className="bg-white/90 hover:bg-pink-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
          title="Adicionar à Lista de Desejos"
        >
          <Heart className="text-pink-500" size={20} />
        </button>

        {/* Botão Meus Livros */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMeusLivros(livro);
          }}
          className="bg-white/90 hover:bg-blue-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
          title="Adicionar a Meus Livros"
        >
          <BookOpen className="text-[#001b4e]" size={20} />
        </button>
      </div>
    </div>
  );
};

function Catalogo({ livros, onAddWishlist, onAddMeusLivros }) {
  // Livros em destaque com imagens reais
  const destaques = [
    {
      id: 101,
      titulo: "Batman: The Dark Knight",
      autor: "Frank Miller",
      capa: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=600&fit=crop",
      avaliacao: 5,
    },
    {
      id: 102,
      titulo: "Seven Husbands of Evelyn Hugo",
      autor: "Taylor Jenkins Reid",
      capa: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      avaliacao: 5,
    },
    {
      id: 103,
      titulo: "Harry Potter e a Pedra Filosofal",
      autor: "J.K. Rowling",
      capa: "https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400&h=600&fit=crop",
      avaliacao: 5,
    },
  ];

  // Livros recomendados com imagens reais
  const recomendacoes = [
    {
      id: 201,
      titulo: "The Black Wolf",
      autor: "Louise Penny",
      capa: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      avaliacao: 4,
    },
    {
      id: 202,
      titulo: "Boom Town",
      autor: "Nic Stone",
      capa: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      avaliacao: 4,
    },
    {
      id: 203,
      titulo: "And Then There Was One",
      autor: "Martha Waters",
      capa: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      avaliacao: 5,
    },
    {
      id: 204,
      titulo: "Tom's Crossing",
      autor: "Mark Z. Danielewski",
      capa: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      avaliacao: 3,
    },
    {
      id: 205,
      titulo: "The Bone Thief",
      autor: "Vanessa Lillie",
      capa: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
      avaliacao: 4,
    },
    {
      id: 206,
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      capa: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
      avaliacao: 5,
    },
    {
      id: 207,
      titulo: "1984",
      autor: "George Orwell",
      capa: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      avaliacao: 5,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
      {/* Legenda dos botões */}
      <div className="flex gap-6 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Heart className="text-pink-500" size={16} />
          <span>Lista de Desejos</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="text-[#001b4e]" size={16} />
          <span>Meus Livros</span>
        </div>
      </div>

      {/* Destaques da semana */}
      <h2 className="text-3xl font-bold text-[#001b4e] mb-8">
        Destaques da semana
      </h2>

      <div className="flex gap-8 items-center overflow-x-auto pb-6 scrollbar-hide">
        {destaques.map((livro) => (
          <div key={livro.id} className="min-w-[300px] relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={livro.capa}
                alt={livro.titulo}
                className="w-full h-80 object-cover"
              />
              {/* Botões de ação */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ActionMenu
                  livro={livro}
                  onAddWishlist={onAddWishlist}
                  onAddMeusLivros={onAddMeusLivros}
                />
              </div>
            </div>
            <p className="font-bold text-sm text-[#001b4e] text-center mt-2 truncate px-1">
              {livro.titulo}
            </p>
            <p className="text-xs text-[#001b4e] text-center truncate px-1">
              {livro.autor}
            </p>
          </div>
        ))}

        <ChevronRight
          className="shrink-0 bg-[#001b4e] text-white p-3 rounded-full cursor-pointer ml-4 shadow-lg"
          size={50}
        />
      </div>

      {/* Livros que você pode gostar */}
      <h2 className="text-3xl font-bold text-[#001b4e] mt-12 mb-8">
        Livros que você pode gostar
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {recomendacoes.map((livro) => (
          <div key={livro.id} className="min-w-[180px] relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={livro.capa}
                alt={livro.titulo}
                className="w-full h-64 object-cover"
              />
              {/* Botões de ação */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ActionMenu
                  livro={livro}
                  onAddWishlist={onAddWishlist}
                  onAddMeusLivros={onAddMeusLivros}
                />
              </div>
            </div>
            <p className="font-bold text-sm text-[#001b4e] text-center mt-2 truncate px-1">
              {livro.titulo}
            </p>
            <p className="text-xs text-[#001b4e] text-center truncate px-1">
              {livro.autor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
