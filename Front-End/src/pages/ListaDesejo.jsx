import React from "react";
import { Trash2, BookOpen, Bell, BellOff } from "lucide-react";
import toast from "react-hot-toast";
import BookCard from "../components/BookCard";

function ListaDesejo({ wishlist, onRemove, onMoverParaMeusLivros, onToggleNotification }) {
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
          <Bell className="text-blue-600" size={16} />
          <span>Ativar/Desativar Notificação</span>
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
            <div key={livro.id} className="relative group">
              <BookCard
                livro={livro}
                showTitle={true}
                showAuthor={true}
                showRating={false}
              />

              {/* Botões de ação flutuantes */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               {/* BOTÃO DE NOTIFICAÇÃO */}
                <button
                  onClick={() => onToggleNotification(livro)}
                  className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
                    livro.notificacao
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
                      : "bg-white/90 text-gray-400 hover:bg-gray-100"
                  }`}
                  title={livro.notificacao ? "Desativar aviso" : "Avisar quando disponível"}
                >
                  {livro.notificacao ? <Bell size={18} fill="currentColor" /> : <BellOff size={18} />}
                </button>
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
                  }}
                  className="bg-white/90 hover:bg-red-100 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  title="Remover da lista"
                >
                  <Trash2 className="text-red-500" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaDesejo;
