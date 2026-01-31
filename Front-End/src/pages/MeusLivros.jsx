import React, { useState } from "react";
import BookCard from "../components/BookCard";
import ModalAvaliacao from "../components/ModalAvaliacao";
import ModalVisualizarAvaliacao from "../components/ModalVisualizarAvaliacao";
import toast from "react-hot-toast";

function MeusLivros({ meusLivros, setMeusLivros, atualizarAvaliacaoLivro }) {
  // Estado para controlar os modais
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Abrir modal correto baseado se livro já tem avaliação
  const handleClickLivro = (livro) => {
    setLivroSelecionado(livro);
    if (livro.avaliacao && livro.avaliacao !== -1) {
      // Livro já tem avaliação - abrir modal de visualização
      setModalVisualizarAberto(true);
    } else {
      // Livro não tem avaliação - abrir modal para criar
      setModoEdicao(false);
      setModalAvaliacaoAberto(true);
    }
  };

  // Fechar modal de avaliação
  const fecharModalAvaliacao = () => {
    setModalAvaliacaoAberto(false);
    setLivroSelecionado(null);
    setModoEdicao(false);
  };

  // Fechar modal de visualização
  const fecharModalVisualizar = () => {
    setModalVisualizarAberto(false);
    setLivroSelecionado(null);
  };

  // Abrir modal de edição (a partir do modal de visualização)
  const handleEditarAvaliacao = (livro) => {
    setModalVisualizarAberto(false);
    setModoEdicao(true);
    setLivroSelecionado(livro);
    setModalAvaliacaoAberto(true);
  };

  // Submeter avaliação (criar ou editar)
  const handleSubmitAvaliacao = (dados) => {
    // Chama a função global que trata o estado central e a API
    atualizarAvaliacaoLivro(dados.livroId, dados.rating, dados.comentario);

    fecharModalAvaliacao();
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
              onClick={() => handleClickLivro(livro)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <BookCard livro={livro} showRating={true} rating={livro.avaliacao} />
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criar/Editar Avaliação */}
      <ModalAvaliacao
        isOpen={modalAvaliacaoAberto}
        onClose={fecharModalAvaliacao}
        livro={livroSelecionado}
        onSubmit={handleSubmitAvaliacao}
        modoEdicao={modoEdicao}
      />

      {/* Modal de Visualizar Avaliação */}
      <ModalVisualizarAvaliacao
        isOpen={modalVisualizarAberto}
        onClose={fecharModalVisualizar}
        livro={livroSelecionado}
        onEdit={handleEditarAvaliacao}
      />
    </div>
  );
}

export default MeusLivros;
