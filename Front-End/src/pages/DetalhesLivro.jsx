import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Star, Calendar, MessageSquare, Heart } from "lucide-react";
import BookCard from "../components/BookCard";
import { getBook, getBookRatings } from "../services/api";
import { useAuth } from "../contexts/AuthContext";


function DetalhesLivro({ livros, onAddWishlist, onAddMeusLivros, meusLivros, wishlist }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [livro, setLivro] = useState(null);

    const [comentarios, setComentarios] = useState([]); // Começa vazio
    const [estaCarregando, setEstaCarregando] = useState(true); // Controla o loading
    const [carregandoComentarios, setCarregandoComentarios] = useState(true);

    const jaEstaNosMeusLivros = meusLivros?.some(i => Number(i.id) === Number(id));
    const jaEstaNaWishlist = wishlist?.some(i => Number(i.id) === Number(id));

    // Efeito para carregar os dados do Livro (Do catálogo local por enquanto)
    const carregarTudo = async () => {
        setEstaCarregando(true);
        setCarregandoComentarios(true);
        try {
            // Roda as duas buscas em paralelo para ganhar tempo
            const [dadosLivro, dadosComentarios] = await Promise.all([
                getBook(id, user?.id),
                getBookRatings(id)
            ]);
            
            setLivro(dadosLivro);
            setEstaCarregando(false);
            setComentarios(dadosComentarios || []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setCarregandoComentarios(false);
        }
    };

    useEffect(() => {
        carregarTudo();
    }, [id, user?.id]);

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

    const related = livros.filter((l) => l.id !== livro.id).slice(0, 4);
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

            <div className="flex flex-col lg:flex-row gap-12 mb-16">
                {/* LADO ESQUERDO */}
                <div className="flex-shrink-0 flex flex-col items-center lg:items-start max-w-xs mx-auto lg:mx-0">
                    <div className="w-[280px] h-[420px] rounded-2xl shadow-2xl overflow-hidden mb-6 relative">
                        <img
                            src={getImageSrc(livro.capa || livro.imagem)}
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
                                {notaUsuario !== null && notaUsuario !== undefined && notaUsuario !== -1 ? notaUsuario : "-"}
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
                                {popularidade}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                        onClick={() => handleAcaoSucesso(onAddMeusLivros, livro)}
                        disabled={jaEstaNosMeusLivros}
                        className={`flex-1 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg 
                        ${jaEstaNosMeusLivros 
                        ? "bg-green-100 text-green-600 cursor-default" 
                        : "bg-[#001b4e] hover:bg-[#002a6e] text-white hover:shadow-xl"}`}
                        >
                        <BookOpen size={24} className={jaEstaNosMeusLivros ? "text-green-600" : ""} />
                        {jaEstaNosMeusLivros ? "Na sua estante" : "Adicionar à lista de leitura"}
                        </button>

                        <button
                            onClick={() => handleAcaoSucesso(onAddWishlist, livro)}
                        className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md"
                        title="Adicionar à Lista de Desejos"
                    >
                    <Heart 
                    size={24} 
                    className={jaEstaNaWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} 
                    />
                    <span className="hidden sm:inline">{jaEstaNaWishlist ? "Está na Lista de Desejos" : "Adicionar à Lista de Desejos"}</span>
                    </button>
                    </div>

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
                            {comentarios.map((comentario, index) => (
                                <div key={index} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar com Inicial */}
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#001b4e] to-blue-600 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm overflow-hidden">
                                                {comentario.fotoDePerfil ? (
                                                    <img
                                                        src={`data:image/jpeg;base64,${comentario.fotoDePerfil}`}
                                                        alt={comentario.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    (comentario.username || "?").charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#001b4e] text-sm">
                                                    {comentario.username || "Usuário Anônimo"}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Calendar size={12} />
                                                    {comentario.dataComentario ? new Date(comentario.dataComentario).toLocaleDateString() : "Data desconhecida"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-yellow-50 px-2 py-1 rounded-lg">
                                            {renderEstrelas(comentario.nota)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        "{comentario.comentario}"
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
                    {related.map((item) => (
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