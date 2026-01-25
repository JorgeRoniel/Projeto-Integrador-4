import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

// Componente de Estrelas
const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Componente de Card de Livro
const BookCard = ({ livro }) => (
  <div className="flex flex-col">
    <div className="w-40 h-56 rounded-lg overflow-hidden shadow-lg mb-2">
      <img
        src={livro.capa}
        alt={livro.titulo}
        className="w-full h-full object-cover"
      />
    </div>
    <h4 className="text-[#001b4e] font-medium text-sm">{livro.titulo}</h4>
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <span>{livro.estrelas} estrelas</span>
    </div>
  </div>
);

function Perfil() {
  // Dados mockados do usuário
  const [usuario, setUsuario] = useState({
    nome: 'Enzo',
    sobrenome: 'Oliveira',
    email: 'Enzo@alu.ufc.br',
    telefone: '8891234-5678',
    avatar: null
  });

  const [senha, setSenha] = useState({
    nova: '',
    confirmar: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('Nenhum arquivo escolhido');
  const fileInputRef = useRef(null);

  // Livros avaliados mockados
  const livrosAvaliados = [
    {
      id: 1,
      titulo: 'Anne de Green Gables',
      capa: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      estrelas: 5
    },
    {
      id: 2,
      titulo: 'Heartstopper',
      capa: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      estrelas: 5
    },
    {
      id: 3,
      titulo: 'Crepúsculo',
      capa: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      estrelas: 2
    },
    {
      id: 4,
      titulo: 'Diário de um Banana',
      capa: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
      estrelas: 4
    }
  ];

  const handleInputChange = (field, value) => {
    setUsuario(prev => ({ ...prev, [field]: value }));
  };

  const handleSenhaChange = (field, value) => {
    setSenha(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNomeArquivo(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
      {/* Título */}
      <h1 className="text-3xl font-bold text-[#001b4e] mb-8">Informações basicas</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna da esquerda - Avatar */}
        <div className="flex flex-col items-start">
          {/* Avatar */}
          <div className="w-64 h-72 bg-purple-200 rounded-2xl flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={120} className="text-purple-600" strokeWidth={1.5} />
            )}
          </div>
          <span className="text-[#001b4e] font-medium mt-3 mb-2">Avatar</span>

          {/* Input de arquivo */}
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={handleChooseFile}
              className="px-4 py-1 border border-gray-400 rounded-l text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Escolher foto
            </button>
            <span className="px-3 py-1 border border-l-0 border-gray-400 rounded-r text-sm text-gray-500 bg-white">
              {nomeArquivo}
            </span>
          </div>
        </div>

        {/* Coluna da direita - Campos do formulário */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Nome:</label>
            <input
              type="text"
              value={usuario.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="w-full border-2 border-[#001b4e] rounded-lg px-4 py-2 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Sobrenome */}
          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Sobrenome:</label>
            <input
              type="text"
              value={usuario.sobrenome}
              onChange={(e) => handleInputChange('sobrenome', e.target.value)}
              className="w-full border-2 border-[#001b4e] rounded-lg px-4 py-2 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Email:</label>
            <input
              type="email"
              value={usuario.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border-2 border-[#001b4e] rounded-lg px-4 py-2 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Telefone:</label>
            <input
              type="tel"
              value={usuario.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              className="w-full border-2 border-[#001b4e] rounded-lg px-4 py-2 outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Seção inferior */}
      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        {/* Coluna da esquerda - Senha */}
        <div className="w-64">
          <h2 className="text-2xl font-bold text-[#001b4e] mb-6">Senha</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[#001b4e] text-sm mb-1">Digite a nova senha:</label>
              <input
                type="password"
                value={senha.nova}
                onChange={(e) => handleSenhaChange('nova', e.target.value)}
                placeholder="••••••••••"
                className="w-full border-b-2 border-gray-300 px-2 py-2 outline-none focus:border-[#001b4e] transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="block text-[#001b4e] text-sm mb-1">Digite novamente a nova senha:</label>
              <input
                type="password"
                value={senha.confirmar}
                onChange={(e) => handleSenhaChange('confirmar', e.target.value)}
                placeholder="••••••••••"
                className="w-full border-b-2 border-gray-300 px-2 py-2 outline-none focus:border-[#001b4e] transition-colors bg-transparent"
              />
            </div>
          </div>

          <Link
            to="/lista-desejo"
            className="inline-block mt-8 text-[#001b4e] font-semibold underline hover:text-purple-600 transition-colors"
          >
            Ir para lista de desejos
          </Link>
        </div>

        {/* Coluna da direita - Livros avaliados */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#001b4e] mb-6">Ultimos livros lidos e avaliados:</h2>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {livrosAvaliados.map((livro) => (
              <BookCard key={livro.id} livro={livro} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
