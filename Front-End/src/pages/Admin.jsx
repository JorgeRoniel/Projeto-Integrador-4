import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Plus, BookPlus, ArrowLeft, Upload, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { addBook, getAdminUsernames, updateUserRole } from "../services/api";

function Admin({ reloadBooks }) {
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();

    // Redireciona se não for admin
    useEffect(() => {
        if (!isAdmin()) {
            navigate("/catalogo");
        }
    }, [isAdmin, navigate]);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        autor: "",
        editora: "",
        edicao: "",
        ano: "",
        categoria: "",
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
        "Autoajuda",
        "Tecnologia",
        "Negócios",
        "Infantil",
        "Poesia",
        "Terror",
        "Aventura",
        "Outros",
    ];

    const [adminUsernames, setAdminUsernames] = useState([]);

    const [roleForm, setRoleForm] = useState({
        username: "",
        role: ""
    });

    const [roleLoading, setRoleLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
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
        if (!formData.categoria) {
            newErrors.categoria = "Selecione uma categoria";
        }
        if (formData.ano && (isNaN(formData.ano) || formData.ano < 1000 || formData.ano > new Date().getFullYear())) {
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
                const base64String = reader.result.split(',')[1];
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

        // Valida tipo de arquivo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione apenas arquivos de imagem');
            return;
        }

        // Valida tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('A imagem deve ter no máximo 5MB');
            return;
        }

        setFormData((prev) => ({ ...prev, imagemUrl: "" }));

        setImagemFile(file);

        // Cria preview da imagem
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

        // Recarrega lista de admins
        const data = await getAdminUsernames();
        setAdminUsernames(data);
    } catch (err) {
        toast.error(err.message || "Erro ao atualizar cargo");
    } finally {
        setRoleLoading(false);
    }
};

    // Remove imagem selecionada
    const handleRemoveImage = () => {
        setImagemFile(null);
        setImagemPreview(null);
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

            // Monta objeto compatível com BookRegisterDTO do backend
            const bookData = {
                titulo: formData.titulo,
                autor: formData.autor,
                editora: formData.editora || null,
                edicao: formData.edicao || null,
                ano_publicacao: formData.ano ? parseInt(formData.ano) : null,
                categorias: formData.categoria ? [formData.categoria] : [],
                descricao: formData.descricao || null,
                imagem: imagemBytes,
                imagemUrl: formData.imagemUrl || null,
                data_aquisicao: formData.data_aquisicao || null,
            };

            await addBook(bookData);
            await reloadBooks();
            toast.success("Livro adicionado com sucesso!");

            // Limpa o formulário
            setFormData({
                titulo: "",
                autor: "",
                editora: "",
                edicao: "",
                ano: "",
                categoria: "",
                descricao: "",
                imagemUrl: "",
                data_aquisicao: "",
            });
            setImagemFile(null);
            setImagemPreview(null);
        } catch (error) {
            console.error("Erro ao adicionar livro:", error);
            toast.error(error.message || "Erro ao adicionar livro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 animate-in fade-in duration-500">
            {/* Header */}
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
                            <p className="text-gray-500 mt-1">Adicione novos livros ao catálogo</p>
                        </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                        🛡️ Admin: {user?.nome || user?.username}
                    </span>
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <Plus size={20} />
                        Adicionar Novo Livro
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Título e Autor - Lado a lado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Título <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="titulo"
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => handleChange("titulo", e.target.value)}
                                    placeholder="Ex: Dom Casmurro"
                                    disabled={isLoading}
                                    className={`w-full rounded-xl border ${errors.titulo ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100`}
                                />
                                {errors.titulo && <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>}
                            </div>

                            <div>
                                <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
                                    Autor <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="autor"
                                    type="text"
                                    value={formData.autor}
                                    onChange={(e) => handleChange("autor", e.target.value)}
                                    placeholder="Ex: Machado de Assis"
                                    disabled={isLoading}
                                    className={`w-full rounded-xl border ${errors.autor ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100`}
                                />
                                {errors.autor && <p className="mt-1 text-sm text-red-500">{errors.autor}</p>}
                            </div>
                        </div>

                        {/* Editora, Edição e Categoria */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="editora" className="block text-sm font-medium text-gray-700 mb-1">
                                    Editora
                                </label>
                                <input
                                    id="editora"
                                    type="text"
                                    value={formData.editora}
                                    onChange={(e) => handleChange("editora", e.target.value)}
                                    placeholder="Ex: Companhia das Letras"
                                    disabled={isLoading}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="edicao" className="block text-sm font-medium text-gray-700 mb-1">
                                    Edição
                                </label>
                                <input
                                    id="edicao"
                                    type="text"
                                    value={formData.edicao}
                                    onChange={(e) => handleChange("edicao", e.target.value)}
                                    placeholder="Ex: 1ª Edição"
                                    disabled={isLoading}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="categoria"
                                    value={formData.categoria}
                                    onChange={(e) => handleChange("categoria", e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full rounded-xl border ${errors.categoria ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100 bg-white`}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categorias.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoria && <p className="mt-1 text-sm text-red-500">{errors.categoria}</p>}
                            </div>
                        </div>

                        {/* Ano, Páginas e ISBN */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className={`w-full rounded-xl border ${errors.ano ? "border-red-500" : "border-gray-300"
                                        } px-4 py-3 outline-none focus:ring-2 focus:ring-[#001b4e] transition-colors disabled:bg-gray-100`}
                                />
                                {errors.ano && <p className="mt-1 text-sm text-red-500">{errors.ano}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Aquisição</label>
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

                        {/* Upload de Imagem */}
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
                                            <span className="font-semibold">Clique para fazer upload</span> ou arraste a imagem
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG ou WEBP (máx. 5MB)</p>
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
                                onChange={(e) => {
                                    handleChange("imagemUrl", e.target.value);

                                    // Se digitou URL, remove imagem uploadada
                                    if (e.target.value) {
                                        setImagemFile(null);
                                        setImagemPreview(null);
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

                        {/* Descrição */}
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição / Sinopse
                            </label>
                            <textarea
                                id="descricao"
                                value={formData.descricao}
                                onChange={(e) => handleChange("descricao", e.target.value)}
                                placeholder="Digite uma breve descrição ou sinopse do livro..."
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
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Adicionando...
                                    </>
                                ) : (
                                    <>
                                        <BookPlus size={20} />
                                        Adicionar Livro
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
