import React from "react";
import { Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

function ListaDesejo({ wishlist, onRemove, onMoverParaMeusLivros }) {
  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-bold text-[#001b4e] mb-6">
        Livros na lista de desejo
      </h2>

      {/* Legenda dos botões */}
      <div className="flex gap-6 mb-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <BookOpen className="text-green-600" size={16} />
          <span>Mover para Meus Livros</span>
        </div>
        <div className="flex items-center gap-2">
          <Trash2 className="text-red-500" size={16} />
          <span>Remover da lista</span>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-xl font-medium">Sua lista está vazia</p>
          <p>Adicione livros clicando no ❤️ do catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
          {wishlist.map((livro) => (
            <div key={livro.id} className="flex flex-col gap-2 group">
              {/* Card da capa do livro */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <img
                  src={livro.capa}
                  alt={livro.titulo}
                  className="w-full h-64 object-cover"
                />

                {/* Botões de ação */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Botão Mover para Meus Livros */}
                  <button
                    onClick={() => onMoverParaMeusLivros(livro)}
                    className="bg-white/90 hover:bg-green-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    title="Mover para Meus Livros"
                  >
                    <BookOpen className="text-green-600" size={18} />
                  </button>

                  {/* Botão Remover */}
                  <button
                    onClick={() => {
                      onRemove(livro.id);
                      toast.success(`"${livro.titulo}" removido da lista!`, {
                        duration: 3000,
                        position: "bottom-right",
                      });
                    }}
                    className="bg-white/90 hover:bg-red-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                    title="Remover da lista"
                  >
                    <Trash2 className="text-red-500" size={18} />
                  </button>
                </div>
              </div>

              {/* Título */}
              <p className="font-bold text-sm text-[#001b4e] text-center truncate px-1">
                {livro.titulo}
              </p>

              {/* Autor */}
              <p className="text-xs text-[#001b4e] text-center truncate px-1">
                {livro.autor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaDesejo;
