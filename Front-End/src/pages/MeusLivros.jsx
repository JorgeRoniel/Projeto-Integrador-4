import React, { useState } from "react";
import BookCard from "../components/BookCard";
import ModalAvaliacao from "../components/ModalAvaliacao";
import toast from "react-hot-toast";

function MeusLivros({ meusLivros, setMeusLivros, atualizarAvaliacaoLivro }) {
  // Estado para controlar o modal
  const [modalAberto, setModalAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  // Abrir modal para avaliar livro
  const abrirModal = (livro) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false);
    setLivroSelecionado(null);
  };

  // Submeter avaliação
  const handleSubmitAvaliacao = (dados) => {
    // Atualiza a avaliação do livro
    atualizarAvaliacaoLivro(dados.livroId, dados.rating);

    toast.success("Avaliação adicionada com sucesso!", {
      duration: 3000,
      position: "bottom-right",
    });

    // Aqui seria feita a chamada para a API quando integrar com o backend
    console.log("Avaliação enviada:", dados);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#001b4e] mb-8">Meus Livros</h1>

      {meusLivros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-xl font-medium">Você ainda não tem livros</p>
          <p>
            Adicione livros clicando no 📖 do catálogo ou mova da lista de
            desejos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
          {meusLivros.map((livro) => (
            <div
              key={livro.id}
              onClick={() => abrirModal(livro)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <BookCard livro={livro} showRating={true} />
            </div>
          ))}
        </div>
      )}

      {/* Modal de Avaliação */}
      <ModalAvaliacao
        isOpen={modalAberto}
        onClose={fecharModal}
        livro={livroSelecionado}
        onSubmit={handleSubmitAvaliacao}
      />
    </div>
  );
}

export default MeusLivros;
