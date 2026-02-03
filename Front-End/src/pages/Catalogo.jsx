import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
} from "lucide-react";
import BookCard from "../components/BookCard";

const ActionMenu = ({
  livro,
  onAddWishlist,
  onAddMeusLivros,
  wishlist,
  meusLivros,
}) => {
  const isWishlisted = wishlist?.some(
    (item) => Number(item.id) === Number(livro.id),
  );
  const isMyBook = meusLivros?.some(
    (item) => Number(item.id) === Number(livro.id),
  );

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddWishlist(livro);
          }}
          className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
            isWishlisted ? "bg-pink-100" : "bg-white/90 hover:bg-pink-100"
          }`}
          title={
            isWishlisted
              ? "Na sua lista de desejos"
              : "Adicionar à Lista de Desejos"
          }
        >
          <Heart
            className={
              isWishlisted ? "text-pink-500 fill-pink-500" : "text-pink-500"
            }
            size={20}
          />
        </button>

        {/* Botão Meus Livros */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMeusLivros(livro);
          }}
          className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
            isMyBook ? "bg-blue-100" : "bg-white/90 hover:bg-blue-100"
          }`}
          title={isMyBook ? "Na sua coleção" : "Adicionar a Meus Livros"}
        >
          <BookOpen
            className={
              isMyBook ? "text-[#001b4e] fill-[#001b4e]" : "text-[#001b4e]"
            }
            size={20}
          />
        </button>
      </div>
    </div>
  );
};

function Catalogo({
  highlights,
  Recomendation,
  listBooks,
  onAddWishlist,
  onAddMeusLivros,
  wishlist,
  meusLivros,
  cacheBusca,
  setCacheBusca,
}) {
  const navigate = useNavigate();
  const [livrosBusca, setLivrosBusca] = useState(cacheBusca.resultados);
  const [searchQuery, setSearchQuery] = useState(cacheBusca.query);
  const [isSearching, setIsSearching] = useState(false);

  const [page, setPage] = useState(cacheBusca.pagina);
  const [hasMore, setHasMore] = useState(cacheBusca.temMais);
  const observer = useRef();

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const lastBookElementRef = useCallback(
    (node) => {
      if (isSearching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isSearching, hasMore],
  );

  useEffect(() => {
    setCacheBusca((prev) => ({
      ...prev,
      query: searchQuery,
      resultados: livrosBusca,
      pagina: page,
      temMais: hasMore,
    }));
  }, [searchQuery, livrosBusca, page, hasMore]);

  useEffect(() => {
    if (cacheBusca.resultados.length !== livrosBusca.length) {
      setLivrosBusca(cacheBusca.resultados);
    }
  }, [cacheBusca.resultados]);

  useEffect(() => {
    if (livrosBusca.length > 0 && cacheBusca.scrollPos > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: cacheBusca.scrollPos,
          behavior: "instant", // 'instant' para não ver a animação de subida
        });
      }, 100);
      return () => clearTimeout(timer);
    }

    const handleScroll = () => {
      setCacheBusca((prev) => ({ ...prev, scrollPos: window.scrollY }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val !== cacheBusca.query) {
      setLivrosBusca([]);
      setPage(0);
      setHasMore(true);
    }
  };

  useEffect(() => {
    if (
      searchQuery === cacheBusca.query &&
      livrosBusca.length > 0 &&
      page === cacheBusca.pagina
    ) {
      return;
    }

    if (searchQuery.trim() === "") {
      setLivrosBusca([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(page);
      } else {
        if (searchQuery === "") {
          setLivrosBusca([]);
        }
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, page]);

  const performSearch = async (pageNumber) => {
    try {
      setIsSearching(true);
      const results = await listBooks(searchQuery.trim(), pageNumber, 20);
      const newBooks = results.content || results || [];
      setLivrosBusca((prev) =>
        pageNumber === 0 ? newBooks : [...prev, ...newBooks],
      );
      setHasMore(newBooks.length === 20);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLivrosBusca([]);
    setPage(0);
    setHasMore(true);
    setCacheBusca({
      query: "",
      resultados: [],
      pagina: 0,
      temMais: true,
      scrollPos: 0,
    });
  };

  const emModoBusca = searchQuery.trim().length > 0 || livrosBusca.length > 0;
  const temDadosIniciais = highlights?.length > 0 || Recomendation?.length > 0;

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
      <div className="mb-10">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative w-full max-w-2xl mx-auto"
        >
          <input
            type="text"
            placeholder="Pesquisar por título, autor ou categoria..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white border-2 border-gray-100 shadow-sm focus:border-[#001b4e] focus:ring-0 transition-all outline-none text-gray-700"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
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
        {isSearching && page === 0 && (
          <p className="text-center mt-2 text-sm text-gray-400 animate-pulse">
            Buscando livros...
          </p>
        )}
      </div>

      {/* LÓGICA DE CONTEÚDO */}
      {emModoBusca ? (
        /* 1. MODO BUSCA (Prioridade total se houver texto ou resultados) */
        <div className="animate-in fade-in duration-500">
          <h2 className="text-3xl font-bold text-[#001b4e] mb-8">
            {searchQuery.trim()
              ? `Resultados para "${searchQuery}"`
              : "Todos os livros"}
          </h2>
          {livrosBusca.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-6">
                {livrosBusca.map((livro, index) => {
                  const isLast = livrosBusca.length === index + 1;
                  return (
                    <div
                      key={`${livro.id}-${index}`}
                      ref={isLast ? lastBookElementRef : null}
                      className="relative group cursor-pointer"
                      onClick={() => navigate(`/livro/${livro.id}`)}
                    >
                      <BookCard
                        livro={livro}
                        showRating={false}
                        showTitle={true}
                        showAuthor={true}
                      />
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
                  );
                })}
              </div>

              {isSearching && page > 0 && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001b4e] mb-2"></div>
                  <p className="text-gray-400 text-sm">
                    Carregando mais livros...
                  </p>
                </div>
              )}

              {!hasMore && (
                <div className="text-center py-12 border-t border-gray-100 mt-8">
                  <p className="text-gray-400 italic text-sm">
                    Você visualizou todos os livros encontrados.
                  </p>
                </div>
              )}
            </>
          ) : (
            !isSearching && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  Nenhum resultado encontrado para sua pesquisa.
                </p>
                <button
                  onClick={clearSearch}
                  className="text-[#001b4e] font-semibold mt-2 hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )
          )}
        </div>
      ) : temDadosIniciais ? (
        /* MODO NORMAL (Destaques e Recomendações) */
        <>
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

          {/* CONTAINER DO CARROSSEL COM PADDING NAS LATERAIS PARA AS SETAS */}
          <div className="relative mb-12"
          style={{ 
                paddingLeft: '3.5rem', 
                paddingRight: '3.5rem'
                }}
                >
            <h2 className="text-3xl font-bold text-[#001b4e] mb-0 -ml-10">
              Destaques da semana
            </h2>

            {/* Seta Esquerda - Fora do fluxo do scroll */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-[50%] -translate-y-1/2 z-20 bg-[#001b4e] text-white p-2 rounded-full shadow-xl hover:bg-blue-900 transition-colors"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Container de Scroll */}
            <div
              ref={scrollRef}
              className="flex gap-8 items-start overflow-x-auto scrollbar-hide scroll-smooth px-5 no-scrollbar"
              style={{ 
                paddingTop: '1.5rem', 
                paddingBottom: '2rem',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
                }}
            >
              {highlights.map((livro) => (
                <div
                  key={livro.id}
                  className="min-w-[300px] flex-shrink-0 relative group cursor-pointer"
                  onClick={() => navigate(`/livro/${livro.id}`)}
                >
                  <BookCard
                    livro={livro}
                    size="large"
                    showTitle={true}
                    showAuthor={true}
                    showRating={false}
                  />

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
            </div>

            {/* Seta Direita - Fora do fluxo do scroll */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-[50%] -translate-y-1/2 z-20 bg-[#001b4e] text-white p-2 rounded-full shadow-xl hover:bg-blue-900 transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* SEÇÃO DE RECOMENDAÇÕES (GRID) */}
          <h2 className="text-3xl font-bold text-[#001b4e] mt-12 mb-8">
            Livros que você pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-6">
            {Recomendation.map((livro) => (
              <div
                key={livro.id}
                className="relative group cursor-pointer"
                onClick={() => navigate(`/livro/${livro.id}`)}
              >
                <BookCard
                  livro={livro}
                  showTitle={true}
                  showAuthor={true}
                  showRating={false}
                />

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
        </>
      ) : (
        /* MODO VAZIO (Banco vazio e sem busca ativa) */
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
          <BookOpen size={64} className="text-gray-300 mb-4" />
          <p className="text-xl text-gray-500 font-medium">
            O catálogo está vazio no momento.
          </p>
          <p className="text-gray-400">
            Tente novamente mais tarde ou use a pesquisa.
          </p>
        </div>
      )}
    </div>
  );
}

export default Catalogo;
