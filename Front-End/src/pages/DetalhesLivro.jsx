import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Star, Calendar, MessageSquare, Heart } from "lucide-react";
import BookCard from "../components/BookCard";
import { getBook, getBookRatings, getRelatedBooks } from "../services/api";
import { useAuth } from "../contexts/AuthContext";


function DetalhesLivro({ onAddWishlist, onAddMeusLivros, meusLivros, wishlist, handleDeletarLivro, refreshCatalogo, cacheBusca, setCacheBusca }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isAdmin = user?.role === 'ADMIN';

    const [livro, setLivro] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [carregandoComentarios, setCarregandoComentarios] = useState(false);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalComentarios, setTotalComentarios] = useState(0);
    const observer = useRef();

    const jaEstaNosMeusLivros = meusLivros?.some(i => Number(i.id) === Number(id));
    const jaEstaNaWishlist = wishlist?.some(i => Number(i.id) === Number(id));

    // Ref para o último elemento (Trigger do Scroll)
    const lastCommentElementRef = useCallback(node => {
        if (carregandoComentarios) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [carregandoComentarios, hasMore]);

    // Carregamento Inicial (Livro e Relacionados)
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setEstaCarregando(true);
            setComentarios([]); 
            setPage(0);
            setHasMore(true);
            try {
                const [dadosLivro, dadosRelacionados] = await Promise.all([
                    getBook(id, user?.id),
                    getRelatedBooks(id)
                ]);
                setLivro(dadosLivro);
                setRelacionados(dadosRelacionados || []);
            } catch (error) {
                console.error("Erro ao carregar dados do livro:", error);
            } finally {
                setEstaCarregando(false);
            }
        };
        carregarDadosIniciais();
    }, [id]);

    // Carregamento Paginado de Comentários
    useEffect(() => {
        const carregarComentariosPaginados = async () => {
            if (!id) return;
            setCarregandoComentarios(true);
            try {
                const dados = await getBookRatings(id, page, 10);
                setComentarios(prev => {
                    return page === 0 ? (dados.content || []) : [...prev, ...(dados.content || [])];
                    });
                setHasMore(!dados.last);
                setTotalComentarios(dados.totalElements || 0);
            } catch (error) {
                console.error("Erro ao carregar comentários:", error);
            } finally {
                setCarregandoComentarios(false);
            }
        };

        carregarComentariosPaginados();
    }, [id, page]);

    const handleAcaoSucesso = async (callbackAcao, item) => {
        try {
            await callbackAcao(item);
            const novosDadosLivro = await getBook(id, user?.id);
            setLivro(novosDadosLivro);
        
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
        }
    };

    // Se o livro principal ainda não carregou
    if (estaCarregando || !livro) {
        return (
            <div className="flex h-screen items-center justify-center text-[#001b4e]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001b4e] mr-3"></div>
                Carregando informações do livro...
            </div>
        );
    }

    const getImageSrc = (img) => {
        if (!img) return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop";
        if (img.startsWith('http') || img.startsWith('data:')) return img;
        return `data:image/jpeg;base64,${img}`;
    };

    const formatarDataRelativa = (data) => {
    if (!data) return "Data desconhecida";
    
    const agora = new Date();
    const dataComentario = new Date(data);
    const diferencaEmSegundos = Math.floor((agora - dataComentario) / 1000);

    // Tabela de intervalos em segundos
    const intervalos = {
        ano: 31536000,
        mes: 2592000,
        semana: 604800,
        dia: 86400,
        hora: 3600,
        minuto: 60
    };

    if (diferencaEmSegundos < 60) return "agora mesmo";

    let count = Math.floor(diferencaEmSegundos / intervalos.ano);
    if (count >= 1) return `há ${count} ${count > 1 ? "anos" : "ano"}`;

    count = Math.floor(diferencaEmSegundos / intervalos.mes);
    if (count >= 1) return `há ${count} ${count > 1 ? "meses" : "mês"}`;

    count = Math.floor(diferencaEmSegundos / intervalos.semana);
    if (count >= 1) return `há ${count} ${count > 1 ? "semanas" : "semana"}`;

    count = Math.floor(diferencaEmSegundos / intervalos.dia);
    if (count >= 1) return `há ${count} ${count > 1 ? "dias" : "dia"}`;

    count = Math.floor(diferencaEmSegundos / intervalos.hora);
    if (count >= 1) return `há ${count} ${count > 1 ? "horas" : "hora"}`;

    count = Math.floor(diferencaEmSegundos / intervalos.minuto);
    if (count >= 1) return `há ${count} ${count > 1 ? "minutos" : "minuto"}`;

    return "há algum tempo";
    };

    const popularidade = (livro?.popularidade || 0).toFixed(0) + "%";
    const notaUsuario = livro?.nota;

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
                    

            <div className="flex flex-col lg:flex-row gap-12 mb-10">
                {/* LADO ESQUERDO */}
                <div className="flex-shrink-0 flex flex-col items-center lg:items-start max-w-xs mx-auto lg:mx-0">
                    <div className="w-[280px] h-[420px] rounded-2xl shadow-2xl overflow-hidden mb-6 relative">
                        <img
                            src={getImageSrc(livro.imagem || livro.capa)}
                            alt={livro.titulo}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-[#001b4e] text-center lg:text-left leading-tight mb-2">{livro.titulo}</h1>
                    <p className="text-lg text-gray-600 font-medium text-center lg:text-left">{livro.autor}</p>
                </div>

                {/* LADO DIREITO */}
                <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
                            <span className="text-sm font-bold text-[#001b4e] mb-1">Nota do usuário</span>
                            <span className="text-3xl font-bold text-[#001b4e]">
                                {notaUsuario !== null && notaUsuario !== undefined && notaUsuario !== -1 ? notaUsuario : "-"}
                            </span>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
                            <span className="text-sm font-bold text-[#001b4e] mb-1">Nota geral</span>
                            <span className="text-3xl font-bold text-[#001b4e] flex items-center gap-1">
                                {livro.media ? livro.media.toFixed(1) : "0.0"} <Star size={20} className="fill-[#001b4e]" />
                            </span>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
                            <span className="text-sm font-bold text-[#001b4e] mb-1">Popularidade</span>
                            <span className="text-3xl font-bold text-[#001b4e]">{popularidade}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                            onClick={() => handleAcaoSucesso(onAddMeusLivros, livro)}
                            disabled={jaEstaNosMeusLivros}
                            className={`flex-1 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg ${jaEstaNosMeusLivros ? "bg-green-100 text-green-600 cursor-default" : "bg-[#001b4e] hover:bg-[#002a6e] text-white"}`}
                        >
                            <BookOpen size={24} /> {jaEstaNosMeusLivros ? "Na sua estante" : "Adicionar à lista de leitura"}
                        </button>
                        <button
                            onClick={() => handleAcaoSucesso(onAddWishlist, livro)}
                            className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md"
                        >
                            <Heart size={24} className={jaEstaNaWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
                            <span className="hidden sm:inline">{jaEstaNaWishlist ? "Na Wishlist" : "Adicionar à Wishlist"}</span>
                        </button>
                    </div>

                    <div className="mb-8 min-w-0">
                        <h3 className="text-lg font-bold text-[#001b4e] mb-3 border-b border-gray-100 pb-2">Sinopse</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-lg sm:text-justify text-left">{livro.descricao || livro.sipnose || "Sinopse indisponível."}</p>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <div className="flex flex-row gap-4 mt-8 p-4 bg-red-50 rounded-xl border border-red-100 w-full">
                <button
                    onClick={async () => { 
                        if (window.confirm("Tem certeza?")) {
                            await handleDeletarLivro(livro.id);
                        }
                        }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                    >
                    DELETAR LIVRO
                </button>

                <button
                    onClick={() => navigate("/admin", { state: { livroParaEditar: livro } })}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                >
                    EDITAR INFORMAÇÕES
                    </button>
                </div>
            )}

            {/* RELACIONADOS (Subiu para antes dos comentários) */}
            {relacionados.length > 0 && (
                <div className="mt-10 mb-16 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-[#001b4e] mb-6">Livros relacionados</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {relacionados.map((item) => (
                            <div key={item.id} onClick={() => navigate(`/livro/${item.id}`)} className="cursor-pointer hover:scale-105 transition-transform">
                                <BookCard livro={item} showTitle={true} showAuthor={true} showRating={false} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* COMENTÁRIOS (Agora no final com Scroll Infinito) */}
            <div className="mt-12">
                <h3 className="text-xl font-bold text-[#001b4e] mb-6 flex items-center gap-2">
                    <MessageSquare size={22} className="text-[#001b4e]" />
                    Avaliações da Comunidade
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{totalComentarios}</span>
                </h3>

                <div className="space-y-4">
                    {comentarios.map((comentario, index) => {
                        const isLast = comentarios.length === index + 1;
                        return (
                            <div 
                                key={`${comentario.id}-${index}`} 
                                ref={isLast ? lastCommentElementRef : null}
                                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#001b4e] to-blue-600 rounded-full flex items-center justify-center text-white font-bold uppercase overflow-hidden">
                                            {comentario.fotoDePerfil ? (
                                                <img src={`data:image/jpeg;base64,${comentario.fotoDePerfil}`} alt={comentario.username} className="w-full h-full object-cover" />
                                            ) : (comentario.username || "?").charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#001b4e] text-sm">{comentario.username || "Usuário Anônimo"}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar size={12} /> 
                                                <span title={new Date(comentario.dataComentario).toLocaleString()}>
                                                    {formatarDataRelativa(comentario.dataComentario)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 px-2 py-1 rounded-lg">{renderEstrelas(comentario.nota)}</div>
                                </div>
                                <p className="text-gray-600 text-sm break-words overflow-hidden leading-relaxed">{comentario.comentario}</p>
                            </div>
                        );
                    })}
                </div>

                {carregandoComentarios && (
                    <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001b4e] mb-2"></div>
                        <p>Carregando mais opiniões...</p>
                    </div>
                )}

                {!hasMore && comentarios.length > 0 && (
                    <p className="text-center text-gray-400 mt-8 text-sm italic">Você chegou ao fim das avaliações.</p>
                )}
            </div>
        </div>
    );
}

export default DetalhesLivro;