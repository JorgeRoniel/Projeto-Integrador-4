import React from 'react';
import { Trash2 } from 'lucide-react';

function ListaDesejo({ wishlist, onRemove }) {
  return (
    /*A tela de lista de desejos*/
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold text-[#001b4e] mb-10">Livros na lista de desejo</h2>
      
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-xl font-medium">Sua lista está vazia</p>
          <p>Adicione livros clicando no "+" do catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-y-12 gap-x-6">
          {wishlist.map((livro) => (
            <div key={livro.id} className="flex flex-col gap-3 group relative">
              
              {/*Botão de remover*/}
              <button 
                onClick={() => onRemove(livro.id)}
                className="absolute -top-2 -right-2 z-10 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remover da lista"
              >
                <Trash2 size={16} />
              </button>

              <div className={`aspect-[2/3] w-full ${livro.cor} rounded-[22px] border-[3px] border-[#001b4e] shadow-lg overflow-hidden`}>
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold p-4 text-center">
                  Capa: {livro.titulo}
                </div>
              </div>
              <p className="font-bold text-[#001b4e] text-sm leading-tight text-center lg:text-left px-1">{livro.titulo}</p>
              <p className="font-bold text-[#001b4e] text-sm leading-tight text-center lg:text-left px-1 opacity-70">{livro.autor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaDesejo;