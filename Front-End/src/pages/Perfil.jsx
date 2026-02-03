import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Loader2, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateUser, getUserRatings, deleteUser } from '../services/api';
import BookCard from '../components/BookCard';
import toast from 'react-hot-toast';

function Perfil() {
  const { user, updateUserData } = useAuth();

  // Estado para dados do usuário
  const [usuario, setUsuario] = useState({
    nome: '',
    username: '',
    email: '',
    telefone: '',
    foto: ''
  });

  const [senha, setSenha] = useState({
    nova: '',
    confirmar: ''
  });

  const [livrosAvaliados, setLivrosAvaliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Inicializa dados do usuário
  useEffect(() => {
    if (user) {
      setUsuario({
        nome: user.nome || '',
        username: user.username || '',
        email: user.email || '',
        telefone: user.telefone || '',
        foto: user.foto || ''
      });

      // Carrega livros avaliados
      async function loadRatings() {
        try {
          const data = await getUserRatings(user.id);
          setLivrosAvaliados(data || []);
        } catch (error) {
          console.error("Erro ao buscar avaliações:", error);
        } finally {
          setLoading(false);
        }
      }
      loadRatings();
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setUsuario(prev => ({ ...prev, [field]: value }));
  };

  const handleSenhaChange = (field, value) => {
    setSenha(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setUsuario(prev => ({ ...prev, foto: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (senha.nova && senha.nova !== senha.confirmar) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      setSaving(true);
      const dataToUpdate = {
        ...usuario,
        senha: senha.nova || undefined // Só envia se mudar
      };

      await updateUser(user.id, dataToUpdate);

      // Atualiza o contexto global para refletir as mudanças (exceto senha)
      updateUserData({
        nome: usuario.nome,
        username: usuario.username,
        email: usuario.email,
        telefone: usuario.telefone,
        foto: usuario.foto
      });

      toast.success("Perfil atualizado com sucesso!");
      setSenha({ nova: '', confirmar: '' });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      const msg = error.message || "Erro ao salvar alterações.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Tem certeza que deseja apagar sua conta? Esta ação é irreversível!")) {
      try {
        setSaving(true);
        await deleteUser(user.id);
        toast.success("Conta excluída com sucesso.");
        // Logout manual (limpa localstorage e recarrega na home)
        localStorage.clear();
        window.location.href = "/";
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
        toast.error("Não foi possível excluir a conta.");
      } finally {
        setSaving(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#001b4e]">Informações básicas</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#001b4e] text-white px-6 py-2 rounded-full hover:bg-[#002b7a] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna da esquerda - Avatar */}
        <div className="flex flex-col items-start">
          <div className="w-64 h-72 bg-purple-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-purple-300">
            {avatarPreview || usuario.foto ? (
              <img
                src={avatarPreview || (usuario.foto.startsWith('http') ? usuario.foto : `data:image/jpeg;base64,${usuario.foto}`)}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={120} className="text-purple-600" strokeWidth={1.5} />
            )}
          </div>
          <span className="text-[#001b4e] font-medium mt-3 mb-2">Avatar</span>

          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-1 border border-gray-400 rounded text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Trocar foto
            </button>
          </div>
        </div>

        {/* Coluna da direita - Campos do formulário */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Nome Completo:</label>
            <input
              type="text"
              value={usuario.nome}
              maxLength={50}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#001b4e] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Nome de Usuário:</label>
            <input
              type="text"
              value={usuario.username}
              maxLength={50}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#001b4e] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Email:</label>
            <input
              type="email"
              value={usuario.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#001b4e] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#001b4e] text-sm mb-1">Telefone:</label>
            <input
              type="tel"
              value={usuario.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-[#001b4e] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Seção inferior */}
      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        {/* Coluna da esquerda - Senha */}
        <div className="w-64">
          <h2 className="text-2xl font-bold text-[#001b4e] mb-6">Segurança</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[#001b4e] text-sm mb-1">Nova senha:</label>
              <input
                type="password"
                value={senha.nova}
                onChange={(e) => handleSenhaChange('nova', e.target.value)}
                placeholder="••••••••••"
                className="w-full border-b-2 border-gray-300 px-2 py-2 outline-none focus:border-[#001b4e] transition-colors bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[#001b4e] text-sm mb-1">Confirmar nova senha:</label>
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

          <div className="mt-12 pt-8 border-t border-gray-100">
            <button
              onClick={handleDeleteAccount}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Apagar minha conta permanentemente
            </button>
          </div>
        </div>

        {/* Coluna da direita - Livros avaliados */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#001b4e] mb-6">Livros avaliados recentemente:</h2>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : livrosAvaliados.length === 0 ? (
            <p className="text-gray-400">Você ainda não avaliou nenhum livro.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {livrosAvaliados.map((livro) => (
                <div key={livro.id} className="min-w-[160px]">
                  <BookCard livro={livro} showTitle showRating={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;
