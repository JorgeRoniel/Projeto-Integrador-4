import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, BookPlus, ArrowLeft, Upload, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  addBook,
  getAdminUsernames,
  updateUserRole,
  updateBook,
  getBookDetailsByIsbn,
} from "../services/api";

function Admin({ onBookAdded }) {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const location = useLocation();
  const livroParaEditar = location.state?.livroParaEditar;
  const modoEdicao = !!livroParaEditar;

  // Redireciona se não for admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/catalogo");
    }
  }, [isAdmin, navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    autor: "",
    isbn: "",
    paginas: "",
    idioma: "",
    preview_url: "",
    editora: "",
    edicao: "",
    ano: "",
    categoria: [],
    descricao: "",
    imagemUrl: "",
    data_aquisicao: "",
  });
  const [errors, setErrors] = useState({});

  // Estados para upload de imagem
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);

  const categorias = [
    "Ficção",
    "Romance",
    "Mistério",
    "Fantasia",
    "Ciência",
    "História",
    "Biografia",
    "Filosofia",
    "Matemática",
    "Religião",
    "Física",
    "Autoajuda",
    "Tecnologia",
    "Negócios",
    "Infantil",
    "Poesia",
    "Sci-fi",
    "Suspense",
    "Política",
    "Finanças",
    "Drama",
    "Distopia",
    "Terror",
    "Aventura",
    "Outros",
  ];

  const [adminUsernames, setAdminUsernames] = useState([]);

  const [roleForm, setRoleForm] = useState({
    username: "",
    role: "",
  });

  const [roleLoading, setRoleLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (modoEdicao && livroParaEditar) {
      const dataFormatada = livroParaEditar.data_aquisicao
        ? livroParaEditar.data_aquisicao.split("T")[0]
        : "";
      setFormData({
        titulo: livroParaEditar.titulo || "",
        subtitulo: livroParaEditar.subtitulo || "",
        autor: livroParaEditar.autor || "",
        isbn: livroParaEditar.isbn || "",
        paginas: livroParaEditar.paginas || "",
        idioma: livroParaEditar.idioma || "",
        preview_url: livroParaEditar.preview_url || "",
        editora: livroParaEditar.editora || "",
        edicao: livroParaEditar.edicao || "",
        ano: livroParaEditar.ano_publicacao?.toString() || "",
        categoria: livroParaEditar.categorias || [],
        descricao: livroParaEditar.descricao || "",
        imagemUrl: livroParaEditar.preview_picture_url || "",
        data_aquisicao: dataFormatada,
      });

      if (livroParaEditar.imagem) {
        const source = livroParaEditar.imagem.startsWith("http")
          ? livroParaEditar.imagem
          : `data:image/jpeg;base64,${livroParaEditar.imagem}`;

        setImagemPreview(source);
      }
    }
  }, [modoEdicao, livroParaEditar]);

  const [isbn, setIsbn] = useState("");

  const handleIsbnSearch = async () => {
    if (!isbn.trim()) return;

    setIsLoading(true);
    try {
      const dadosLivro = await getBookDetailsByIsbn(isbn);

      if (dadosLivro) {
        const dataFormatada = dadosLivro.data_aquisicao
          ? dadosLivro.data_aquisicao.split("T")[0]
          : "";
        const categoriasMapeadas = (dadosLivro.categorias || [])
          .map((catGoogle) => {
            return categorias.find(
              (minhaCat) =>
                minhaCat.toLowerCase() === catGoogle.toLowerCase() ||
                (catGoogle === "Fiction" && minhaCat === "Ficção") ||
                (catGoogle === "Science" && minhaCat === "Ciência") ||
                (catGoogle === "History" && minhaCat === "História") ||
                (catGoogle === "Mystery" && minhaCat === "Mistério"),
            );
          })
          .filter(Boolean);

        setFormData((prev) => ({
          ...prev,
          titulo: dadosLivro.titulo || "",
          subtitulo: dadosLivro.subtitulo || "",
          autor: dadosLivro.autor || "",
          isbn: dadosLivro.isbn || isbn, // Usa o que veio ou o que foi digitado
          paginas: dadosLivro.paginas || "",
          idioma: dadosLivro.idioma || "",
          preview_url: dadosLivro.preview_url || "",
          editora: dadosLivro.editora || "",
          edicao: "", // Google Books raramente traz isso, mantemos vazio para o usuário preencher
          ano: dadosLivro.ano_publicacao?.toString() || "", // Converte para string para o input
          categoria:
            categoriasMapeadas.length > 0 ? categoriasMapeadas : prev.categoria,
          descricao: dadosLivro.descricao || "",
          imagemUrl: dadosLivro.imagemUrl || "",
          data_aquisicao: dataFormatada, // A data formatada aqui!
        }));

        if (dadosLivro.imagemUrl) {
          setImagemPreview(dadosLivro.imagemUrl);
          setImagemFile(null);
        }

        toast.success("Dados importados do Google com sucesso!");
      }else{
        toast.error("Livro não encontrado para este ISBN");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao buscar ISBN");
    } finally {
      setIsLoading(false);
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório";
    }
    if (!formData.autor.trim()) {
      newErrors.autor = "O autor é obrigatório";
    }
    if (!formData.categoria || formData.categoria.length === 0) {
      newErrors.categoria = "Selecione uma categoria";
    }
    if (
      formData.ano &&
      (isNaN(formData.ano) ||
        formData.ano < 1000 ||
        formData.ano > new Date().getFullYear())
    ) {
      newErrors.ano = "Ano inválido";
    }

    return newErrors;
  };

  // Converte arquivo de imagem para array de bytes (base64)
  const fileToByteArray = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Pega apenas a parte base64 (remove o prefixo "data:image/...;base64,")
        const base64String = reader.result.split(",")[1];
        // Converte base64 para array de bytes
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        resolve(Array.from(bytes));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handler para upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setImagemFile(file);
    setFormData((prev) => ({ ...prev, imagemUrl: "" }));

    const reader = new FileReader();
    reader.onload = () => {
      setImagemPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Busca admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdminUsernames();
        setAdminUsernames(data);
      } catch (err) {
        toast.error("Erro ao carregar administradores");
      }
    };

    fetchAdmins();
  }, []);

  // Muda cargo
  const handleRoleChange = async () => {
    if (!roleForm.username || !roleForm.role) {
      toast.error("Preencha o username e selecione o cargo");
      return;
    }

    setRoleLoading(true);
    try {
      await updateUserRole(roleForm.username, roleForm.role);
      toast.success("Cargo atualizado com sucesso");

      setRoleForm({ username: "", role: "" });

      const data = await getAdminUsernames();
      setAdminUsernames(data);
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar cargo");
    } finally {
      setRoleLoading(false);
    }
  };

  const handleToggleCategoria = (cat) => {
    setFormData((prev) => {
      const jaSelecionada = prev.categoria.some(c => c.toLowerCase() === cat.toLowerCase());
      const novasCategorias = jaSelecionada
        ? prev.categoria.filter((c) => c !== cat) // Remove se já existir
        : [...prev.categoria, cat]; // Adiciona se não existir

      return { ...prev, categoria: novasCategorias };
    });
  };

  // Remove imagem selecionada
  const handleRemoveImage = () => {
    setImagemFile(null);
    setImagemPreview(null);
    setFormData((prev) => ({ ...prev, imagemUrl: "" }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const validationErrors = validarFormulario();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      let imagemBytes = null;
      if (!formData.imagemUrl && imagemFile) {
        imagemBytes = await fileToByteArray(imagemFile);
      }

      const dataIso = formData.data_aquisicao
        ? `${formData.data_aquisicao}T00:00:00`
        : null;

      const bookData = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo || null,
        autor: formData.autor,
        edicao: formData.edicao || null,
        isbn: formData.isbn || null,
        ano_publicacao: formData.ano ? parseInt(formData.ano) : null,
        editora: formData.editora || null,
        categorias: formData.categoria,
        imagem: imagemBytes,
        imagemUrl: formData.imagemUrl || null,
        descricao: formData.descricao || null,
        data_aquisicao: dataIso,
        paginas: formData.paginas ? parseInt(formData.paginas) : null,
        idioma: formData.idioma || null,
        preview_url: formData.preview_url || null,
      };

      await updateBook(livroParaEditar.id, bookData);
      await onBookAdded();

      toast.success("Livro atualizado com sucesso!");
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar livro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validarFormulario();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsLoading(true);
    try {
      // Converte imagem para bytes se existir
      let imagemBytes = null;
      if (imagemFile && !formData.imagemUrl) {
        imagemBytes = await fileToByteArray(imagemFile);
      }

      const dataIso = formData.data_aquisicao
        ? `${formData.data_aquisicao}T00:00:00`
        : null;

      // Monta objeto compatível com BookRegisterDTO do backend
      const bookData = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo || null,
        autor: formData.autor,
        edicao: formData.edicao || null,
        isbn: formData.isbn || null,
        ano_publicacao: formData.ano ? parseInt(formData.ano) : null,
        editora: formData.editora || null,
        categorias: formData.categoria ? formData.categoria : [],
        imagem: imagemBytes,
        imagemUrl: formData.imagemUrl || null,
        descricao: formData.descricao || null,
        data_aquisicao: dataIso,
        paginas: formData.paginas ? parseInt(formData.paginas) : null,
        idioma: formData.idioma || null,
        preview_url: formData.preview_url || null,
      };

      await addBook(bookData);
      await onBookAdded();
      toast.success("Livro adicionado com sucesso!");

      // Limpa o formulário
      setFormData({
        titulo: "",
        subtitulo: "",
        autor: "",
        isbn: "",
        paginas: "",
        idioma: "",
        preview_url: "",
        editora: "",
        edicao: "",
        ano: "",
        categoria: [],
        descricao: "",
        imagemUrl: "",
        data_aquisicao: "",
      });
      setImagemFile(null);
      setImagemPreview(null);
      setIsbn("");
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      toast.error(error.message || "Erro ao adicionar livro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Voltar"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#001b4e] flex items-center gap-3">
                <BookPlus className="text-yellow-500" size={32} />
                Painel de Administração
              </h1>
              <p className="text-gray-500 mt-1">
                {livroParaEditar
                  ? "Edite livros do sistema"
                  : "Adicione novos livros ao catálogo"}
              </p>
            </div>
          </div>
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
            🛡️ Admin: {user?.nome || user?.username}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus size={20} />
            {livroParaEditar ? "Editar livro" : "Adicionar Novo Livro"}
          </h2>

          <form
            onSubmit={livroParaEditar ? handleEdit : handleSubmit}
            className="space-y-6"
          >
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Importar dados via ISBN
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ex: 9788535914849"
                  value={isbn}
                  maxLength={20}
                  onChange={(e) => setIsbn(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleIsbnSearch();
                    }
                  }}
                  className="flex-1 rounded-xl border border-blue-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
                />
                <button
                  type="button"
                  onClick={handleIsbnSearch}
                  disabled={isLoading}
                  className="bg-[#001b4e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002a6e] transition-all disabled:bg-gray-400"
                >
                  {isLoading ? "Buscando..." : "Buscar"}
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Isso preencherá automaticamente título, autor, editora,
                descrição e capa.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="titulo"
                  type="text"
                  value={formData.titulo}
                  maxLength={255}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  placeholder="Ex: Dom Casmurro"
                  disabled={isLoading}
                  className={`w-full rounded-xl border ${
                    errors.titulo ? "border-red-500" : "border-gray-300"
                  } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100`}
                />
                {errors.titulo && (
                  <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="autor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Autor <span className="text-red-500">*</span>
                </label>
                <input
                  id="autor"
                  type="text"
                  value={formData.autor}
                  maxLength={255}
                  onChange={(e) => handleChange("autor", e.target.value)}
                  placeholder="Ex: Machado de Assis"
                  disabled={isLoading}
                  className={`w-full rounded-xl border ${
                    errors.autor ? "border-red-500" : "border-gray-300"
                  } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100`}
                />
                {errors.autor && (
                  <p className="mt-1 text-sm text-red-500">{errors.autor}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.subtitulo}
                    maxLength={255}
                    onChange={(e) => handleChange("subtitulo", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
                    placeholder="Ex: O Início da Jornada"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    ISBN-13
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    maxLength={20}
                    onChange={(e) => handleChange("isbn", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
                    placeholder="978..."
                  />
                </div>
              </div>

              {/* Preview URL */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Link de Preview (Google Books)
                </label>
                <input
                  type="text"
                  value={formData.preview_url}
                  maxLength={1000}
                  onChange={(e) => handleChange("preview_url", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
                  placeholder="https://books.google.com/..."
                />
              </div>
            </div>

            {/* Editora, Edição e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editora"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Editora
                </label>
                <input
                  id="editora"
                  type="text"
                  value={formData.editora}
                  maxLength={100}
                  onChange={(e) => handleChange("editora", e.target.value)}
                  placeholder="Ex: Companhia das Letras"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="edicao"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Edição
                </label>
                <input
                  id="edicao"
                  type="text"
                  value={formData.edicao}
                  maxLength={45}
                  onChange={(e) => handleChange("edicao", e.target.value)}
                  placeholder="Ex: 1ª Edição"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorias <span className="text-red-500">*</span>
              </label>

              {/* Área de Tags com Flex-Wrap */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {formData.categoria.length > 0 ? (
                  formData.categoria.map((cat) => (
                    <span
                      key={cat}
                      className="flex items-center gap-1 bg-[#001b4e] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => handleToggleCategoria(cat)}
                        className="hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    Nenhuma categoria selecionada
                  </span>
                )}
              </div>

              {/* Select para escolher novas */}
              <select
                id="categoria"
                value=""
                onChange={(e) => {
                  if (e.target.value) handleToggleCategoria(e.target.value);
                }}
                disabled={isLoading}
                className={`w-full rounded-xl border ${errors.categoria ? "border-red-500" : "border-gray-300"} px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] bg-white`}
              >
                <option value="">Clique para adicionar categorias...</option>
                {categorias
                  .filter((cat) => !formData.categoria.includes(cat))
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
              {errors.categoria && (
                <p className="mt-1 text-sm text-red-500">{errors.categoria}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    value={formData.paginas}
                    onChange={(e) => handleChange("paginas", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Idioma
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.idioma}
                    onChange={(e) => handleChange("idioma", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
                    placeholder="Ex: Português"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="ano"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ano de Publicação
                </label>
                <input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => handleChange("ano", e.target.value)}
                  placeholder="Ex: 1899"
                  disabled={isLoading}
                  min="1000"
                  max={new Date().getFullYear()}
                  className={`w-full rounded-xl border ${
                    errors.ano ? "border-red-500" : "border-gray-300"
                  } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100`}
                />
                {errors.ano && (
                  <p className="mt-1 text-sm text-red-500">{errors.ano}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Aquisição
              </label>
              <input
                type="date"
                name="data_aquisicao"
                value={formData.data_aquisicao}
                onChange={(e) => handleChange("data_aquisicao", e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-400">
                Deixe em branco para considerar a data de hoje.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem da Capa
              </label>

              {!imagemPreview ? (
                <label
                  htmlFor="imagemUpload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#001b4e] hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Clique para fazer upload
                      </span>{" "}
                      ou arraste a imagem
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG ou WEBP (máx. 5MB)
                    </p>
                  </div>
                  <input
                    id="imagemUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={imagemPreview}
                    alt="Preview da capa"
                    className="w-32 h-44 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
                    title="Remover imagem"
                  >
                    <X size={16} />
                  </button>
                  <p className="mt-2 text-xs text-gray-500 truncate max-w-[128px]">
                    {imagemFile?.name}
                  </p>
                </div>
              )}
            </div>
            {/* URL da Imagem (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da imagem da capa (opcional)
              </label>

              <input
                type="url"
                value={formData.imagemUrl}
                maxLength={1000}
                onChange={(e) => {
                  handleChange("imagemUrl", e.target.value);

                  // Se digitou URL, remove imagem uploadada
                  if (e.target.value) {
                    setImagemFile(null);
                    setImagemPreview(e.target.value);
                  }
                }}
                placeholder="https://exemplo.com/capa.jpg"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none
                                        focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100"
              />

              <p className="text-xs text-gray-500 mt-1">
                Se preenchido, o upload de imagem será ignorado.
              </p>
            </div>

            <div>
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição / Sinopse
              </label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Digite uma breve descrição ou sinopse do livro..."
                maxLength={1000}
                disabled={isLoading}
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100 resize-none"
              />
            </div>

            {/* Botão de Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#001b4e] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#002a6e] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {livroParaEditar ? "Editando..." : "Adicionando..."}
                  </>
                ) : (
                  <>
                    <BookPlus size={20} />
                    {livroParaEditar ? "Editar livro" : "Adicionar Livro"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🛡️ Administradores do Sistema
          </h2>

          {adminUsernames.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum admin encontrado.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {adminUsernames.map((username) => (
                <span
                  key={username}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {username}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            🔁 Alterar role de usuário
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Username do usuário"
              value={roleForm.username}
              onChange={(e) =>
                setRoleForm((prev) => ({ ...prev, username: e.target.value }))
              }
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e]"
            />

            <select
              value={roleForm.role}
              onChange={(e) =>
                setRoleForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] bg-white"
            >
              <option value="">Selecione a role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button
              onClick={handleRoleChange}
              disabled={roleLoading}
              className="bg-[#001b4e] text-white rounded-xl font-bold px-6 py-3 hover:bg-[#002a6e] transition disabled:bg-gray-400"
            >
              {roleLoading ? "Atualizando..." : "Atualizar role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
