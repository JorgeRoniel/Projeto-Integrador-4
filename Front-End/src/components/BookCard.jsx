import React from "react";
import StarRating from "./StarRating";

function BookCard({
  livro,
  size = "normal",
  showRating = true,
  showTitle = false,
  showAuthor = false,
  actionButton = null,
  onAction = null,
  rating = null,
}) {
  const heightClass = 
  size === "large" ? "h-80" : 
  size === "medium" ? "h-72" : 
  "h-64";

  // Se imagem for um array de bytes (Base64 vindo da API)
  const getImagePath = (img) => {
    if (!img)
      return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"; // Placeholder
    if (typeof img === "string") {
      if (img.startsWith("http") || img.startsWith("data:")) return img;
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

        {/* Avaliação sobreposta no topo */}
        {showRating === true && (
          <div className="absolute top-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <StarRating rating={rating ?? livro.avaliacao} />
            </div>
          </div>
        )}

        {/* Informações de Título e Autor sobrepostas na base */}
        {(showTitle || showAuthor) && (
          <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent backdrop-blur-[2px] flex flex-col justify-end p-2 pointer-events-none">
            {showTitle && (
              <p className="font-bold text-sm text-white text-center truncate px-2">
                {livro.titulo}
              </p>
            )}
            {showAuthor && (
              <p className="text-[10px] text-gray-300 text-center truncate px-2">
                {livro.autor}
              </p>
            )}
          </div>
        )}

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
    </div>
  );
}

export default BookCard;
