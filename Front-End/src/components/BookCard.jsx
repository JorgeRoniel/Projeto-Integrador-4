import React from "react";
import StarRating from "./StarRating";

function BookCard({
    livro,
    size = 'normal',
    showRating = true,
    showTitle = false,
    showAuthor = false,
    actionButton = null,
    onAction = null,
    rating = null
}) {

    const heightClass = size === 'large' ? 'h-80' : 'h-64';

    // Se imagem for um array de bytes (Base64 vindo da API)
    const getImagePath = (img) => {
        if (!img) return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"; // Placeholder
        if (typeof img === 'string') {
            if (img.startsWith('http') || img.startsWith('data:')) return img;
            return `data:image/jpeg;base64,${img}`;
        }
        return img;
    };

    return (
        <div className="flex flex-col gap-2 group">
            {/* Card da capa do livro */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <img
                    src={getImagePath(livro.imagem || livro.capa)}
                    alt={livro.titulo}
                    className={`w-full ${heightClass} object-cover`}
                />

                {/* Botão de ação */}
                {actionButton && onAction && (
                    <button
                        onClick={onAction}
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                    >
                        {actionButton}
                    </button>
                )}
            </div>

            {/* Avaliação */}
            {(showRating === true) && (
                <div className="flex justify-center">
                    <StarRating rating={rating ?? livro.avaliacao} />
                </div>
            )}

            {/* Título */}
            {showTitle && (
                <p className="font-bold text-sm text-[#001b4e] text-center truncate px-1">
                    {livro.titulo}
                </p>
            )}

            {/* Autor */}
            {showAuthor && (
                <p className="text-xs text-[#001b4e] text-center truncate px-1">
                    {livro.autor}
                </p>
            )}
        </div>
    );
}

export default BookCard