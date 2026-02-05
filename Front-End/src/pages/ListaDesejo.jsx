import React, { useState, useEffect, useRef, useCallback } from "react";
import { Trash2, BookOpen, Bell, BellOff, Search, Loader2 } from "lucide-react";
import BookCard from "../components/BookCard";
import { getUserWishlist } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function ListaDesejo({
  wishlist,
  setWishlist,
  onRemove,
  onMoverParaMeusLivros,
  onToggleNotification,
  hasMoreWishListGlobal,
}) {
  const { user } = useAuth();

  // Estados de controle da paginação
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(hasMoreWishListGlobal);
  const [estaCarregando, setEstaCarregando] = useState(false);

  const observer = useRef();

  const ultimoTermoBuscado = useRef("");

  const lastBookElementRef = useCallback(
    (node) => {
      if (estaCarregando) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !estaCarregando) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [estaCarregando, hasMore],
  );

  // Função para carregar os dados da API
  const loadData = async (páginaAlvo, isInitial = false) => {
    if (!user?.id) return;
    if (!isInitial && !hasMore) return;
    setEstaCarregando(true);

    try {
      const data = await getUserWishlist(
        Number(user.id),
        páginaAlvo,
        20,
        termoPesquisa,
      );
      const list = data?.content || [];

      setWishlist((prev) => {
        const novaLista = isInitial ? list : [...prev, ...list];
        // Filtra duplicados pelo ID do livro
        return novaLista.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );
      });
      setHasMore(!data.last);
    } catch (error) {
      console.error("Erro ao carregar wishlist:", error);
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    setHasMore(hasMoreWishListGlobal);
  }, [hasMoreWishListGlobal]);

  // Reset sempre que o usuário ou o termo de pesquisa mudar
  useEffect(() => {
    if (
      termoPesquisa === "" &&
      ultimoTermoBuscado.current === "" &&
      wishlist.length > 0
    ) {
      return;
    }
    const handler = setTimeout(() => {
      if (termoPesquisa === ultimoTermoBuscado.current && wishlist.length > 0)
        return;
      setPage(0);
      setWishlist([]);
      loadData(0, true);
      ultimoTermoBuscado.current = termoPesquisa;
    }, 400);

    return () => clearTimeout(handler);
  }, [termoPesquisa, user?.id]);

  // Carrega mais quando o 'page' aumenta via scroll
  useEffect(() => {
    if (page > 0 && hasMore && !estaCarregando) {
      loadData(page, false);
    }
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto p-10 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-[#001b4e]">
          Livros na lista de desejo
        </h2>

        {/* BARRA DE PESQUISA (Dispara o useEffect para nova busca) */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Pesquisar nos meus desejos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#001b4e]"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
      </div>

      {/* Legenda dos botões */}
      <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <BookOpen className="text-green-600" size={16} />
          <span>Mover para Meus Livros</span>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="text-blue-600" size={16} />
          <span>Notificações</span>
        </div>
        <div className="flex items-center gap-2">
          <Trash2 className="text-red-500" size={16} />
          <span>Remover</span>
        </div>
      </div>

      {wishlist.length === 0 && !estaCarregando ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
          <p className="text-xl font-medium">
            {termoPesquisa.length === 0
              ? "Sua lista está vazia"
              : "Nenhum livro encontrado para essa busca"}
          </p>
          <p className="mt-2">
            {termoPesquisa.length === 0
              ? "Adicione livros clicando no ❤️ do catálogo."
              : "Tente pesquisar por outro título, autor ou categoria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {wishlist.map((livro, index) => {
            const isLast = wishlist.length === index + 1;
            return (
              <div
                key={`${livro.id}-${index}`}
                ref={isLast ? lastBookElementRef : null}
                className="relative group"
              >
                <BookCard
                  livro={livro}
                  showTitle={true}
                  showAuthor={true}
                  showRating={false}
                  size="medium"
                />

                {/* Botões flutuantes */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    onClick={() => onToggleNotification(livro)}
                    className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
                      livro.notificacao
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-white/90 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {livro.notificacao ? (
                      <Bell size={18} fill="currentColor" />
                    ) : (
                      <BellOff size={18} />
                    )}
                  </button>

                  <button
                    onClick={() => onMoverParaMeusLivros(livro)}
                    className="bg-white/90 hover:bg-green-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <BookOpen className="text-green-600" size={18} />
                  </button>

                  <button
                    onClick={() => onRemove(livro.id)}
                    className="bg-white/90 hover:bg-red-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <Trash2 className="text-red-500" size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Círculo de carregamento */}
      {estaCarregando && (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Loader2 className="animate-spin text-[#001b4e]" size={32} />
          <p className="text-sm text-gray-500 italic">
            Carregando livros desejados...
          </p>
        </div>
      )}

      {/* Mensagem de fim da lista */}
      {!hasMore && wishlist.length > 0 && (
        <div className="text-center py-10 border-t border-gray-100 mt-10">
          <p className="text-gray-400 italic text-sm font-medium">
            Fim da lista de desejos. 📚
          </p>
        </div>
      )}
    </div>
  );
}

export default ListaDesejo;
