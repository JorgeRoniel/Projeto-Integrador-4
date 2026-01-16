import React from "react";
import StarRating from "./StarRating";

function BookCard({
    livro,
    size = 'normal',
    showRating = true,
    showTitle = false,
    showAuthor = false,
    actionButton = null,
    onAction = null
}) {

    const heightClass = size === 'large' ? 'h-80' : 'h-64';

    return (
        <div className="flex flex-col gap-2 group">
            {/* Card da capa do livro */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <img
                    src={livro.capa}
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
            {showRating && (
                <div className="flex justify-center">
                    <StarRating rating={livro.avaliacao} />
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