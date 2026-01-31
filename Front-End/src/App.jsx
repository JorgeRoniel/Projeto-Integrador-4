import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import logoEscura from "./assets/logo-branco.png";
import logoClara from "./assets/logo-roxa.png";

import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";
import {
  listBooks,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  rateBook,
  getUserRatings,
  checkNotifications,
  updateNotificationStatus,
} from "./services/api";
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
    loadBooks();
  }, []);

  const loadBooks = async () => {
  try {
    setIsLoadingBooks(true);
    const data = await listBooks(0, 50);
    setLivros(data.content || data || []);
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
    toast.error("Não foi possível carregar o catálogo.");
  } finally {
    setIsLoadingBooks(false);
  }
};

// Novo useEffect para verificar notificações de disponibilidade
  useEffect(() => {
    async function verifyNotifications() {
      if (user?.id) {
        try {
          const notifications = await checkNotifications(user.id);
        
          if (notifications && notifications.length > 0) {
            notifications.forEach((notif) => {

              toast.success(
                `O livro "${notif.title}" já chegou à biblioteca!`,
                {
                  duration: 6000, 
                  icon: "📚",
                  style: {
                    border: '1px solid #001b4e',
                    padding: '16px',
                    color: '#001b4e',
                  },
                }
              );
            });
          }
        } catch (error) {
          console.error("Erro ao buscar notificações:", error);
        }
      }
    }

    verifyNotifications();
  }, [user?.id]);

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
          const data = await getUserRatings(Number(user.id));
          const formatted = (data || []).map((book) => ({
            ...book,
            // Prioridade para 'nota' que agora vem no ReturnBookShortDTO
            avaliacao:
              book.nota !== undefined && book.nota !== null  && book.nota !== -1
                ? Number(book.nota)
                : book.rating || 0,
          }));
          setMeusLivros(formatted);
        } catch (error) {
          console.warn("[Meus Livros] Lista vazia ou erro:", error);
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
        setWishlist((prev) => [...prev, livro]);
        toast.success(`"${livro.titulo}" adicionado à lista de desejos!`);
      } catch (error) {
        // Se já existe (409), atualizamos o estado local para refletir isso
        if (error.status === 409 || String(error.message).includes("409")) {
          setWishlist((prev) => {
            if (!prev.find((item) => Number(item.id) === bookId)) {
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

const handleToggleNotification = async (livro) => {
  if (!user?.id) return;

  if (livro.data_aquisicao) {
    // O replace garante que o JS não mude o dia por causa do fuso.
    const dataAquisicao = new Date(livro.data_aquisicao.replace(/-/g, '\/'));
    dataAquisicao.setHours(0, 0, 0, 0);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (hoje >= dataAquisicao) {
      toast(`O livro "${livro.titulo}" já está disponível na biblioteca!`, {
        icon: "📚",
      });
      return;
    }
  }
  const novoStatus = !livro.notificacao;

  try {
    await updateNotificationStatus({
      user_id: user.id,
      book_id: livro.id,
      notificacao: novoStatus
    });

    setWishlist((prev) =>
      prev.map((item) =>
        item.id === livro.id ? { ...item, notificacao: novoStatus } : item
      )
    );

    if (novoStatus) {
      toast.success("Notificação ativada! Te avisaremos quando chegar.");
    } else {
      toast.success("Notificações desativadas para este livro.");
    }
  } catch (error) {
    toast.error("Erro ao atualizar preferência de notificação.");
    console.error(error);
  }
};

  // Função para remover um livro da lista de desejo
  const removerDaListaDesejo = async (id) => {
    if (!user) return;
    try {
      await removeFromWishlist(Number(user.id), Number(id));
      setWishlist((prev) =>
        prev.filter((livro) => Number(livro.id) !== Number(id)),
      );
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

    if (livro.data_aquisicao) {
        const dataAquisicao = new Date(livro.data_aquisicao.replace(/-/g, '\/'));
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        dataAquisicao.setHours(0,0,0,0);

        if (hoje < dataAquisicao) {
            toast.error("Este livro ainda não chegou na biblioteca. Adicione à Lista de Desejos para ser avisado!");
            return;
        }
    }

    const bookId = Number(livro.id);
    const userId = Number(user.id);
    if (!meusLivros.find((item) => Number(item.id) === bookId)) {
      try {
        await rateBook(bookId, userId, -1);
        const livroComAvaliacao = { ...livro, id: bookId, avaliacao: -1 };
        setMeusLivros((prev) => [...prev, livroComAvaliacao]);
        toast.success(`"${livro.titulo}" adicionado a Meus Livros!`);
      } catch (error) {
        console.error("Erro ao adicionar:", error);
        toast.error("Erro ao adicionar a Meus Livros.");
      }
    } else {
      toast.error("Este livro já está em Meus Livros!");
    }
  };

  // Função para mover livro da lista de desejos para "Meus Livros"
  const moverParaMeusLivros = async (livro) => {
    const bookId = Number(livro.id);
    const userId = Number(user.id);
    if (!meusLivros.find((item) => Number(item.id) === bookId)) {
      try {
        await rateBook(bookId, userId, -1);
        await removeFromWishlist(userId, bookId);

        const livroComAvaliacao = { ...livro, id: bookId, avaliacao: -1 };
        setMeusLivros((prev) => [...prev, livroComAvaliacao]);
        setWishlist((prev) =>
          prev.filter((item) => Number(item.id) !== bookId),
        );

        toast.success(`"${livro.titulo}" movido para Meus Livros!`);
      } catch (error) {
        console.error("Erro ao mover:", error);
        toast.error("Erro ao mover para Meus Livros.");
      }
    } else {
      toast.error("Este livro já está em Meus Livros!");
    }
  };

  // Função para atualizar avaliação de um livro em "Meus Livros"
  const atualizarAvaliacaoLivro = async (
    livroId,
    avaliacao,
    comentario = "",
  ) => {
    if (!user) return;
    const bId = Number(livroId);
    const uId = Number(user.id);
    try {
      await rateBook(bId, uId, Number(avaliacao), String(comentario));
      setMeusLivros((prevLivros) =>
        prevLivros.map((livro) =>
          Number(livro.id) === bId
            ? { ...livro, id: bId, avaliacao, comentario }
            : livro,
        ),
      );
      toast.success("Avaliação salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast.error("Erro ao salvar avaliação.");
    }
  };

  const isAppView = [
    "/dashboard",
    "/catalogo",
    "/meus-livros",
    "/lista-desejo",
    "/perfil",
  ].includes(location.pathname) || location.pathname.startsWith("/livro/");

  return (
    <div className="min-h-screen w-full bg-white font-sans flex overflow-hidden">
      <Toaster />

      {/* Tela que você vai após o login */}
      {isAppView && (
        <div className="flex w-full h-screen overflow-hidden animate-in fade-in">
          <Sidebar logoClara={logoClara} />

          <main className="flex-1 h-screen overflow-y-auto p-10 bg-white">
            {/* A barra de busca no topo da página */}
            {/* A barra de busca foi removida daqui pois já existe no Catálogo */}

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
              reloadBooks={loadBooks}
              handleToggleNotification={handleToggleNotification}
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
          reloadBooks={loadBooks}
          handleToggleNotification={handleToggleNotification}
        />
      )}
    </div>
  );
}

export default App;
