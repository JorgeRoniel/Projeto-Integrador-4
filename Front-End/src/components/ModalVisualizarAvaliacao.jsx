import React from "react";
import { useEffect } from "react";
import { X, Pencil } from "lucide-react";

// Componente de Estrelas (apenas visualização)
const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-8 h-8 ${
            star <= rating ? "text-[#001b4e]" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

    const getImageSrc = (img) => {
        if (!img) return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop";
        if (img.startsWith('http') || img.startsWith('data:')) return img;
        return `data:image/jpeg;base64,${img}`;
    };

function ModalVisualizarAvaliacao({ isOpen, onClose, livro, onEdit }) {
  if (!isOpen || !livro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8 animate-in zoom-in-95 fade-in duration-200">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Título do livro */}
        <h2 className="text-2xl font-bold text-[#001b4e] mb-2">
          {livro.titulo}
        </h2>

        {/* Estrelas */}
        <div className="mb-6">
          <StarRatingDisplay rating={livro.avaliacao} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Capa do livro */}
          <div className="flex-shrink-0">
            <div className="w-44 h-64 rounded-xl overflow-hidden shadow-lg border-4 border-[#001b4e]">
              <img
                src={getImageSrc(livro.imagem || livro.capa)}
                alt={livro.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Comentário */}
          <div className="flex-1 flex flex-col w-full min-w-0 min-h-[250px] justify-between">
            <p className="whitespace-pre-wrap break-words text-gray-700 text-lg leading-relaxed overflow-hidden">
              {livro.descricao || livro.comentario || (
                <span className="text-gray-400 italic">
                  Nenhum comentário adicionado.
                </span>
              )}
            </p>

            {/* Botão Editar */}
            <button
              onClick={() => onEdit(livro)}
              className="mt-6 flex items-center justify-center gap-2 w-full bg-[#001b4e] hover:bg-[#002a6e] text-white font-bold py-4 px-8 rounded-full transition-colors uppercase tracking-wider"
            >
              <Pencil size={20} />
              Editar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalVisualizarAvaliacao;
