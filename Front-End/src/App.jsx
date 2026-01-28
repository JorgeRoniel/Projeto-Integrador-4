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

  // 
  useEffect(() => {
    async function loadBooks() {
      try {
        setIsLoadingBooks(true);
        // Tenta buscar da API
        const data = await listBooks(0, 50);
        const livrosDaApi = data.content || data || [];

        // SE A API NÃO RETORNAR NADA (Lista vazia), USA DADOS FAKE
        if (livrosDaApi.length === 0) {
            console.log("API vazia, carregando dados de teste...");
            setLivros([
                {
                    id: 1,
                    titulo: "The Black Wolf",
                    autor: "autor",
                    capa: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop", 
                    sinopse: "sinopse",
                    media: 4.8,
                    popularidade: "95%",
                    avaliacao: null 
                },
                {
                    id: 2,
                    titulo: "Harry Potter",
                    autor: "autor",
                    capa: "https://images.unsplash.com/photo-1626618012641-bf8ca5564394?q=80&w=800&auto=format&fit=crop",
                    sinopse: "sinopse",
                    media: 5.0,
                    popularidade: "100%",
                    avaliacao: null
                },
                {
                    id: 3,
                    titulo: "Senhor dos Anéis",
                    autor: "autor",
                    capa: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=800&auto=format&fit=crop",
                    sinopse: "sinopse",
                    media: 4.9,
                    popularidade: "98%",
                    avaliacao: null
                },
                {
                    id: 4,
                    titulo: "Clean Code",
                    autor: "autor",
                    capa: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
                    sinopse: "sinopse",
                    media: 4.7,
                    popularidade: "90%",
                    avaliacao: null
                }
            ]);
            toast("Modo Teste: Livros fictícios carregados!", { icon: '🧪', duration: 4000 });
        } else {
            // Se tiver livros no banco real, usa eles
            setLivros(livrosDaApi);
        }
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
        // Se der erro de conexão, também carrega os fakes para não travar a tela
        setLivros([
            {
                id: 99,
                titulo: "Livro de Teste (Erro de Conexão)",
                autor: "Sistema",
                capa: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
                sinopse: "Este livro aparece porque houve um erro ao conectar com o servidor.",
                media: 1.0
            }
        ]);
        toast.error("Erro de conexão. Usando dados de teste.");
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
          const data = await getUserRatings(Number(user.id));
          const formatted = (data || []).map(book => ({
            ...book,
            avaliacao: book.nota !== undefined && book.nota !== null ? Number(book.nota) : (book.rating || book.media || 0)
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
    // Se for mock/teste (ID < 100), fazemos a lógica local só no front
    if (livro.id < 100) {
         if (!wishlist.find((item) => Number(item.id) === Number(livro.id))) {
             setWishlist(prev => [...prev, livro]);
             toast.success(`"${livro.titulo}" adicionado (Teste)!`);
         } else {
             toast.error("Já está na lista (Teste)!");
         }
         return;
    }

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
        }
      }
    } else {
      toast.error("Este livro já está na sua lista de desejos!");
    }
  };

  // Função para remover um livro da lista de desejo
  const removerDaListaDesejo = async (id) => {
    // Lógica local para teste
    if (Number(id) < 100) {
        setWishlist(prev => prev.filter((livro) => Number(livro.id) !== Number(id)));
        toast.success("Removido (Teste)");
        return;
    }

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
    // Lógica local para teste
    if (Number(livro.id) < 100) {
        if (!meusLivros.find((item) => Number(item.id) === Number(livro.id))) {
             const livroComAvaliacao = { ...livro, avaliacao: 0 };
             setMeusLivros(prev => [...prev, livroComAvaliacao]);
             toast.success(`"${livro.titulo}" adicionado (Teste)!`);
        } else {
             toast.error("Já está nos seus livros (Teste)!");
        }
        return;
    }

    if (!user) {
      toast.error("Faça login para salvar seus livros!");
      return;
    }

    const bookId = Number(livro.id);
    const userId = Number(user.id);
    if (!meusLivros.find((item) => Number(item.id) === bookId)) {
      try {
        await rateBook(bookId, userId, 0);
        const livroComAvaliacao = { ...livro, id: bookId, avaliacao: 0 };
        setMeusLivros(prev => [...prev, livroComAvaliacao]);
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
    // Lógica local para teste
    if (Number(livro.id) < 100) {
        if (!meusLivros.find((item) => Number(item.id) === Number(livro.id))) {
             const livroComAvaliacao = { ...livro, avaliacao: 0 };
             setMeusLivros(prev => [...prev, livroComAvaliacao]);
             setWishlist(prev => prev.filter((item) => Number(item.id) !== Number(livro.id)));
             toast.success(`"${livro.titulo}" movido (Teste)!`);
        }
        return;
    }

    const bookId = Number(livro.id);
    const userId = Number(user.id);
    if (!meusLivros.find((item) => Number(item.id) === bookId)) {
      try {
        await rateBook(bookId, userId, 0);
        await removeFromWishlist(userId, bookId);

        const livroComAvaliacao = { ...livro, id: bookId, avaliacao: 0 };
        setMeusLivros(prev => [...prev, livroComAvaliacao]);
        setWishlist(prev => prev.filter((item) => Number(item.id) !== bookId));

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
  const atualizarAvaliacaoLivro = async (livroId, avaliacao, comentario = "") => {
    // Lógica local para teste
    if (Number(livroId) < 100) {
         setMeusLivros((prevLivros) =>
            prevLivros.map((livro) =>
              Number(livro.id) === Number(livroId) ? { ...livro, avaliacao, comentario } : livro,
            ),
          );
          toast.success("Avaliação salva (Teste)!");
          return;
    }

    if (!user) return;
    const bId = Number(livroId);
    const uId = Number(user.id);
    try {
      await rateBook(bId, uId, Number(avaliacao), String(comentario));
      setMeusLivros((prevLivros) =>
        prevLivros.map((livro) =>
          Number(livro.id) === bId ? { ...livro, id: bId, avaliacao, comentario } : livro,
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
    // Se a rota começa com /livro/ então é app view
    location.pathname.startsWith("/livro/") 
  ].some(path => path === true || location.pathname.startsWith("/livro/"));

  // Correção da lógica acima para garantir que /livro/:id mostre a sidebar
  const showSidebar = [
    "/dashboard",
    "/catalogo",
    "/meus-livros",
    "/lista-desejo",
    "/perfil"
  ].includes(location.pathname) || location.pathname.startsWith("/livro/");

  return (
    <div className="min-h-screen w-full bg-white font-sans flex overflow-hidden">
      <Toaster />

      {/* Tela com Sidebar (Logado) */}
      {showSidebar && (
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

      {/* Tela Cheia (Login/Cadastro) */}
      {!showSidebar && (
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