import React, { useState } from "react";
import { Heart, BookOpen, ChevronRight, Search, X } from "lucide-react";
import { searchBooks } from "../services/api";
import BookCard from "../components/BookCard";

// Componente de Menu de Ações
const ActionMenu = ({ livro, onAddWishlist, onAddMeusLivros, wishlist, meusLivros }) => {
  const [menuAberto, setMenuAberto] = useState(false);

  const isWishlisted = wishlist?.some(item => Number(item.id) === Number(livro.id));
  const isMyBook = meusLivros?.some(item => Number(item.id) === Number(livro.id));

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
          className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${isWishlisted ? "bg-pink-100" : "bg-white/90 hover:bg-pink-100"
            }`}
          title={isWishlisted ? "Na sua lista de desejos" : "Adicionar à Lista de Desejos"}
        >
          <Heart
            className={isWishlisted ? "text-pink-500 fill-pink-500" : "text-pink-500"}
            size={20}
          />
        </button>

        {/* Botão Meus Livros */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMeusLivros(livro);
          }}
          className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${isMyBook ? "bg-blue-100" : "bg-white/90 hover:bg-blue-100"
            }`}
          title={isMyBook ? "Na sua coleção" : "Adicionar a Meus Livros"}
        >
          <BookOpen
            className={isMyBook ? "text-[#001b4e] fill-[#001b4e]" : "text-[#001b4e]"}
            size={20}
          />
        </button>
      </div>
    </div>
  );
};

function Catalogo({ livros: initialLivros, onAddWishlist, onAddMeusLivros, wishlist, meusLivros }) {
  const [livros, setLivros] = React.useState(initialLivros);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Sincroniza com as props se não houver busca ativa
  React.useEffect(() => {
    if (!searchQuery) {
      setLivros(initialLivros);
    }
  }, [initialLivros, searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setLivros(initialLivros);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchBooks(searchQuery);
      setLivros(results || []);
    } catch (error) {
      console.error("Erro na busca:", error);
      setLivros([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLivros(initialLivros);
  };

  // Pegamos os 3 primeiros para destaques e o restante para recomendações
  const destaques = livros.slice(0, 3);
  const recomendacoes = livros.slice(3);

  if (!initialLivros || initialLivros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <BookOpen size={64} className="text-gray-300 mb-4" />
        <p className="text-xl text-gray-500 font-medium">O catálogo está vazio no momento.</p>
        <p className="text-gray-400">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
      {/* Barra de Busca */}
      <div className="mb-10">
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Pesquisar por título, autor ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border-2 border-gray-100 shadow-sm focus:border-[#001b4e] focus:ring-0 transition-all outline-none text-gray-700"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </form>
        {isSearching && (
          <p className="text-center mt-2 text-sm text-gray-400 animate-pulse">Buscando livros...</p>
        )}
      </div>

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
            <BookCard
              livro={livro}
              size="large"
              showTitle={true}
              showAuthor={true}
              showRating={false}
            />
            {/* Botões de ação flutuantes */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ActionMenu
                livro={livro}
                onAddWishlist={onAddWishlist}
                onAddMeusLivros={onAddMeusLivros}
                wishlist={wishlist}
                meusLivros={meusLivros}
              />
            </div>
          </div>
        ))}

        {livros.length > 3 && (
          <ChevronRight
            className="shrink-0 bg-[#001b4e] text-white p-3 rounded-full cursor-pointer ml-4 shadow-lg"
            size={50}
          />
        )}
      </div>

      {/* Livros que você pode gostar */}
      <h2 className="text-3xl font-bold text-[#001b4e] mt-12 mb-8">
        Livros que você pode gostar
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-6">
        {recomendacoes.map((livro) => (
          <div key={livro.id} className="relative group">
            <BookCard
              livro={livro}
              showTitle={true}
              showAuthor={true}
            />
            {/* Botões de ação flutuantes */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ActionMenu
                livro={livro}
                onAddWishlist={onAddWishlist}
                onAddMeusLivros={onAddMeusLivros}
                wishlist={wishlist}
                meusLivros={meusLivros}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
