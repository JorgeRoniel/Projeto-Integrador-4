import React, { useState } from 'react';
import { X } from 'lucide-react';

// Componente de Estrelas Interativas
const StarRatingInput = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className={`w-10 h-10 cursor-pointer transition-colors ${
              star <= (hover || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

function ModalAvaliacao({ isOpen, onClose, livro, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Por favor, selecione uma nota!');
      return;
    }

    onSubmit({
      livroId: livro.id,
      rating,
      comentario
    });

    // Resetar campos
    setRating(0);
    setComentario('');
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setComentario('');
    onClose();
  };

  if (!isOpen || !livro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8 animate-in zoom-in-95 fade-in duration-200">
        {/* Botão fechar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Título do livro */}
        <h2 className="text-2xl font-bold text-[#001b4e] mb-6">{livro.titulo}</h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Capa do livro */}
          <div className="flex-shrink-0">
            <div className="w-44 h-64 rounded-lg overflow-hidden shadow-lg">
              <img
                src={livro.capa}
                alt={livro.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Formulário de avaliação */}
          <div className="flex-1 flex flex-col">
            {/* Nota */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#001b4e] mb-3">
                Qual nota avalia esse livro?
              </h3>
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            {/* Comentário */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#001b4e] mb-3">
                Adicione seu comentário:
              </h3>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva sua opinião sobre o livro..."
                className="w-full h-32 p-4 bg-gray-100 rounded-lg resize-none outline-none focus:ring-2 focus:ring-[#001b4e] transition-all"
              />
            </div>

            {/* Botão de enviar */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-colors uppercase tracking-wider"
            >
              Adicionar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAvaliacao;
