import React from 'react';
import { PlusCircle, ChevronRight } from 'lucide-react';


function Catalogo({ livros, onAdd }) {
  return (
    /*Tela de catalogo de livros com destaques da semana e o que você pode gostar */
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold text-[#001b4e] mb-8">Destaques da semana</h2>
      <div className="flex gap-8 items-center overflow-x-auto pb-6 scrollbar-hide">
        
        {livros.slice(0, 3).map((livro) => (
          <div key={livro.id} className={`relative min-w-[300px] h-[320px] ${livro.cor} rounded-[35px] border-l-[12px] border-[#001b4e] overflow-hidden shadow-xl`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-10 flex flex-col justify-end">
              <h3 className="text-white font-bold text-xl">{livro.titulo}</h3>
              <p className="text-white/80">{livro.autor}</p>
              <PlusCircle 
                className="absolute bottom-6 right-6 text-blue-400 cursor-pointer hover:scale-110 transition-transform" 
                size={40} 
                onClick={() => onAdd(livro)}
              />
            </div>
          </div>
        ))}
        <ChevronRight className="shrink-0 bg-[#001b4e] text-white p-3 rounded-full cursor-pointer ml-4 shadow-lg" size={50} />
      </div>

      <h2 className="text-2xl font-bold text-[#001b4e] mt-12 mb-8">Livros que você pode gostar</h2>
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {livros.map((livro) => (
          <div key={livro.id} className="min-w-[180px] flex flex-col gap-2 group cursor-pointer relative">
            <div className={`aspect-[2/3] ${livro.cor} rounded-[20px] border-2 border-[#001b4e] overflow-hidden relative`}>
              <button 
                onClick={() => onAdd(livro)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PlusCircle className="text-white" size={40} />
              </button>
            </div>
            <p className="font-bold text-sm text-[#001b4e] truncate">{livro.titulo}</p>
            <p className="text-xs text-[#001b4e] font-bold ">{livro.autor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;