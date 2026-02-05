import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import BookCard from "../components/BookCard";
import ModalAvaliacao from "../components/ModalAvaliacao";
import ModalVisualizarAvaliacao from "../components/ModalVisualizarAvaliacao";
import { getUserRatings } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function MeusLivros({
  meusLivros,
  setMeusLivros,
  atualizarAvaliacaoLivro,
  hasMoreMeusLivrosGlobal,
}) {
  const { user } = useAuth();
  const ultimoTermoBuscado = useRef("");

  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(hasMoreMeusLivrosGlobal);
  const [estaCarregando, setEstaCarregando] = useState(false);

  // Estado para controlar os modais
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const observer = useRef();

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

  // Função de carregamento que alimenta o setMeusLivros global
  const loadData = async (páginaAlvo, isInitial = false) => {
    if (!user?.id) return;
    if (!isInitial && !hasMore) return;
    setEstaCarregando(true);

    try {
      const data = await getUserRatings(
        Number(user.id),
        false,
        páginaAlvo,
        20,
        "book.title,asc",
        termoPesquisa,
      );

      const list = (data?.content || []).map((book) => ({
        ...book,
        avaliacao:
          book.nota !== undefined && book.nota !== null && book.nota !== -1
            ? Number(book.nota)
            : -1,
      }));

      // Se for a primeira página, substitui. Se for scroll, concatena.
      setMeusLivros((prev) => {
        const novaLista = isInitial ? list : [...prev, ...list];
        // Filtra duplicados pelo ID do livro
        return novaLista.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );
      });
      setHasMore(!data.last);
    } catch (error) {
      toast.error("Erro ao carregar livros:", error);
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    setHasMore(hasMoreMeusLivrosGlobal);
  }, [hasMoreMeusLivrosGlobal]);

  useEffect(() => {
    if (
      termoPesquisa === "" &&
      ultimoTermoBuscado.current === "" &&
      meusLivros.length > 0
    ) {
      return;
    }
    const handler = setTimeout(() => {
      if (termoPesquisa === ultimoTermoBuscado.current && meusLivros.length > 0)
        return;
      setPage(0);
      setMeusLivros([]);
      loadData(0, true);
      ultimoTermoBuscado.current = termoPesquisa;
    }, 400);

    return () => clearTimeout(handler);
  }, [termoPesquisa, user?.id]);

  // Carrega mais quando a página muda pelo scroll
  useEffect(() => {
    if (page > 0 && hasMore && !estaCarregando) {
      loadData(page, false);
    }
  }, [page]);

  // Abrir modal correto baseado se livro já tem avaliação
  const handleClickLivro = (livro) => {
    setLivroSelecionado(livro);
    if (
      livro.avaliacao !== null &&
      livro.avaliacao !== undefined &&
      livro.avaliacao !== -1
    ) {
      setModalVisualizarAberto(true);
    } else {
      setModoEdicao(false);
      setModalAvaliacaoAberto(true);
    }
  };

  // Fechar modal de avaliação
  const fecharModalAvaliacao = () => {
    setModalAvaliacaoAberto(false);
    setLivroSelecionado(null);
    setModoEdicao(false);
  };

  // Fechar modal de visualização
  const fecharModalVisualizar = () => {
    setModalVisualizarAberto(false);
    setLivroSelecionado(null);
  };

  // Abrir modal de edição (a partir do modal de visualização)
  const handleEditarAvaliacao = (livro) => {
    setModalVisualizarAberto(false);
    setModoEdicao(true);
    setLivroSelecionado(livro);
    setModalAvaliacaoAberto(true);
  };

  const handleSubmitAvaliacao = async (dados) => {
    try {
      const res = await atualizarAvaliacaoLivro(
        dados.livroId,
        dados.rating,
        dados.comentario,
      );
      fecharModalAvaliacao();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="max-w-7xl p-10 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#001b4e]">Meus Livros</h1>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Pesquisar na minha estante..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#001b4e]"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
      </div>
      {meusLivros.length === 0 && !estaCarregando ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
          <p className="text-xl font-medium">
            {termoPesquisa.length === 0
              ? "Sua estante está vazia"
              : "Nenhum livro encontrado para essa busca"}
          </p>
          <p className="mt-2">
            {termoPesquisa.length === 0
              ? "Adicione livros clicando no 📖 no catálogo."
              : "Tente pesquisar por outro título, autor ou categoria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {meusLivros.map((livro, index) => {
            const isLast = meusLivros.length === index + 1;
            return (
              <div
                key={`${livro.id}-${index}`}
                ref={isLast ? lastBookElementRef : null}
                onClick={() => handleClickLivro(livro)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <BookCard
                  livro={livro}
                  showTitle={true}
                  showAuthor={true}
                  showRating={livro.avaliacao !== -1}
                  rating={livro.avaliacao}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Loader de Scroll */}
      {estaCarregando && (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Loader2 className="animate-spin text-[#001b4e]" size={32} />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      )}

      {/* Fim da lista */}
      {!hasMore && meusLivros.length > 0 && (
        <div className="text-center py-10 border-t border-gray-100 mt-10">
          <p className="text-gray-400 italic text-sm">Fim da sua estante.</p>
        </div>
      )}

      {/* Modal de Criar/Editar Avaliação */}
      <ModalAvaliacao
        isOpen={modalAvaliacaoAberto}
        onClose={fecharModalAvaliacao}
        livro={livroSelecionado}
        onSubmit={handleSubmitAvaliacao}
        modoEdicao={modoEdicao}
      />

      {/* Modal de Visualizar Avaliação */}
      <ModalVisualizarAvaliacao
        isOpen={modalVisualizarAberto}
        onClose={fecharModalVisualizar}
        livro={livroSelecionado}
        onEdit={handleEditarAvaliacao}
      />
    </div>
  );
}

export default MeusLivros;
