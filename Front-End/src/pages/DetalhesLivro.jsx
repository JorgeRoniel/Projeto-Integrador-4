import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Star, Calendar, MessageSquare } from "lucide-react";
import BookCard from "../components/BookCard";


function DetalhesLivro({ livros, onAddWishlist, onAddMeusLivros }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [livro, setLivro] = useState(null);
  
  
  const [comentarios, setComentarios] = useState([]); // Começa vazio
  const [carregandoComentarios, setCarregandoComentarios] = useState(true); // Controla o loading

  // Efeito para carregar os dados do Livro (Do catálogo local por enquanto)
  useEffect(() => {
    if (livros && livros.length > 0) {
      const livroEncontrado = livros.find((l) => String(l.id) === String(id));
      setLivro(livroEncontrado);
    }
  }, [id, livros]);


  // Efeito para carregar os Comentários (Aqui deveriamos ter feito uma parte de comentarios no banco)
   useEffect(() => {
    async function fetchComentarios() {
      setCarregandoComentarios(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Aqui definimos comentários específicos para cada ID
        const bancoDeComentarios = {
            // ID 1 (The Black Wolf)
            "1": [
                { id: 1, usuarioNome: "Ricardo Souza", dataPostagem: "10/01/2024", nota: 5, texto: "Que suspense incrível! Armand Gamache nunca decepciona." },
                { id: 2, usuarioNome: "Fernanda Lima", dataPostagem: "12/01/2024", nota: 4, texto: "Muito bom, mas o meio do livro é um pouco lento." }
            ],
            // ID 2 (Harry Potter)
            "2": [
                { id: 3, usuarioNome: "PotterHead_99", dataPostagem: "05/02/2024", nota: 5, texto: "Um clássico eterno. Hogwarts é meu lar." },
                { id: 4, usuarioNome: "Lucas M.", dataPostagem: "06/02/2024", nota: 5, texto: "Melhor livro infantil já escrito." },
                { id: 5, usuarioNome: "Ana B.", dataPostagem: "08/02/2024", nota: 5, texto: "Reli pela décima vez e continua mágico." }
            ],
            // ID 3 (Senhor dos Anéis)
            "3": [
                { id: 6, usuarioNome: "Gandalf Fan", dataPostagem: "20/12/2023", nota: 5, texto: "A obra prima da fantasia. Tolkien é gênio." }
            ],
            // ID 4 (Clean Code)
            "4": [
                { id: 7, usuarioNome: "Dev Senior", dataPostagem: "15/03/2024", nota: 5, texto: "Todo programador deveria ler. Mudou minha carreira." },
                { id: 8, usuarioNome: "Estudante JS", dataPostagem: "16/03/2024", nota: 3, texto: "Conteúdo ótimo, mas os exemplos em Java são difíceis pra quem não sabe a linguagem." }
            ]
        };

        // Verifica se existe comentário para esse ID, se não, vai retornar um array vazio
        // O String(id) garante que pegamos o ID mesmo se vier como número ou texto
        const comentariosDesteLivro = bancoDeComentarios[String(id)] || [];
        
        setComentarios(comentariosDesteLivro);

      } catch (error) {
        console.error("Erro:", error);
        setComentarios([]);
      } finally {
        setCarregandoComentarios(false);
      }
    }

    if (id) {
        fetchComentarios();
    }
  }, [id]);


  // Se o livro principal ainda não carregou
  if (!livro) {
    return (
      <div className="flex h-screen items-center justify-center text-[#001b4e]">
        Carregando informações do livro...
      </div>
    );
  }

  const relacionados = livros.filter((l) => l.id !== livro.id).slice(0, 4);

  const renderEstrelas = (nota) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= nota ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[#001b4e] mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* LADO ESQUERDO */}
        <div className="flex-shrink-0 flex flex-col items-center lg:items-start max-w-xs mx-auto lg:mx-0">
          <div className="w-[280px] h-[420px] rounded-2xl shadow-2xl overflow-hidden mb-6 relative">
            <img
              src={livro.capa || livro.imagem}
              alt={livro.titulo}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#001b4e] text-center lg:text-left leading-tight mb-2">
            {livro.titulo}
          </h1>
          <p className="text-lg text-gray-600 font-medium text-center lg:text-left">
            {livro.autor}
          </p>
        </div>

        {/* LADO DIREITO */}
        <div className="flex-1">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
              <span className="text-sm font-bold text-[#001b4e] mb-1">Nota do usuário</span>
              <span className="text-3xl font-bold text-[#001b4e]">
                {livro.avaliacao ? livro.avaliacao : "-"}
              </span>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
              <span className="text-sm font-bold text-[#001b4e] mb-1">Nota geral</span>
              <span className="text-3xl font-bold text-[#001b4e] flex items-center gap-1">
                {livro.media ? livro.media.toFixed(1) : "0.0"}
                <Star size={20} className="fill-[#001b4e]" />
              </span>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
              <span className="text-sm font-bold text-[#001b4e] mb-1">Popularidade</span>
              <span className="text-3xl font-bold text-[#001b4e]">
                 {livro.popularidade ? livro.popularidade : "85%"}
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddWishlist(livro)}
            className="w-full sm:w-auto bg-[#001b4e] hover:bg-[#002a6e] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl mb-10"
          >
            <BookOpen size={24} />
            Adicionar a lista de leitura
          </button>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#001b4e] mb-3 border-b border-gray-100 pb-2">
              Sinopse
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg text-justify">
              {livro.sinopse || livro.descricao || "Sinopse indisponível."}
            </p>
          </div>

          {/* --- SEÇÃO DINÂMICA DE COMENTÁRIOS --- */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#001b4e] mb-6 flex items-center gap-2">
                Avaliações da Comunidade 
                {!carregandoComentarios && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {comentarios.length}
                    </span>
                )}
            </h3>

            {/* Estado de Carregamento */}
            {carregandoComentarios && (
                <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001b4e] mb-2"></div>
                    <p>Carregando opiniões...</p>
                </div>
            )}

            {/* Lista Vazia */}
            {!carregandoComentarios && comentarios.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500 font-medium">Este livro ainda não tem avaliações.</p>
                    <p className="text-sm text-gray-400">Seja o primeiro a deixar sua opinião!</p>
                </div>
            )}

            {/* Lista de Comentários */}
            <div className="space-y-4">
                {comentarios.map((comentario) => (
                    <div key={comentario.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                {/* Avatar com Inicial */}
                                <div className="w-10 h-10 bg-gradient-to-br from-[#001b4e] to-blue-600 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm">
                                    {comentario.usuarioNome ? comentario.usuarioNome.charAt(0) : "?"}
                                </div>
                                <div>
                                    <p className="font-bold text-[#001b4e] text-sm">
                                        {comentario.usuarioNome || "Usuário Anônimo"}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Calendar size={12} />
                                        {comentario.dataPostagem || "Data desconhecida"}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 px-2 py-1 rounded-lg">
                                {renderEstrelas(comentario.nota)}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            "{comentario.texto || comentario.comentario}"
                        </p>
                    </div>
                ))}
            </div>
          </div>
          {/* ------------------------------------- */}

        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-[#001b4e] mb-6">Livros relacionados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {relacionados.map((item) => (
            <div 
                key={item.id} 
                onClick={() => navigate(`/livro/${item.id}`)}
                className="cursor-pointer hover:scale-105 transition-transform"
            >
              <BookCard livro={item} showTitle={true} showAuthor={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetalhesLivro;