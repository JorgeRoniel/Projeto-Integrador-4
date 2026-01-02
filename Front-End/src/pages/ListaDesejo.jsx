import React from 'react';
import { Trash2 } from 'lucide-react';
import BookCard from '../components/BookCard';
import toast from 'react-hot-toast';

function ListaDesejo({ wishlist, onRemove }) {
  return (
    /*A tela de lista de desejos*/
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-bold text-[#001b4e] mb-10">Livros na lista de desejo</h2>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-xl font-medium">Sua lista está vazia</p>
          <p>Adicione livros clicando no "+" do catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
          {wishlist.map((livro) => (
            <BookCard
              key={livro.id}
              livro={livro}
              showRating={false}
              showTitle={true}
              showAuthor={true}
              actionButton={<Trash2 className="text-red-500" size={16} />}
              onAction={() => {
                // Remove imediatamente
                onRemove(livro.id);

                // Mostra toast com botão "Desfazer"
                toast.success(
                  `"${livro.titulo}" removido!`,
                  {
                    duration: 4000,
                    position: 'bottom-right',
                  }
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaDesejo;