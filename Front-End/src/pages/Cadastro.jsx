import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Cadastro({ logoEscura, logoClara }) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    usuario: "",
    senha: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarTelefone = (telefone) => {
    // Remove caracteres não numéricos para validação
    const apenasNumeros = telefone.replace(/\D/g, "");
    return apenasNumeros.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validação de campos obrigatórios
    if (!formData.nome.trim()) {
      newErrors.nome = "O nome é obrigatório";
    }

    if (!formData.sobrenome.trim()) {
      newErrors.sobrenome = "O sobrenome é obrigatório";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "O telefone é obrigatório";
    } else if (!validarTelefone(formData.telefone)) {
      newErrors.telefone = "Telefone inválido. Deve ter pelo menos 10 dígitos";
    }

    if (!formData.email.trim()) {
      newErrors.email = "O email é obrigatório";
    } else if (!validarEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = "O usuário é obrigatório";
    }

    if (!formData.senha) {
      newErrors.senha = "A senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter no mínimo 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    // Chama a API de cadastro
    setIsLoading(true);
    try {
      const result = await register(formData);

      if (result.success) {
        toast.success(
          "Cadastro realizado com sucesso! Faça login para continuar.",
        );
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(result.error || "Erro ao realizar cadastro");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    /*Tela de cadastro caso clique no botão a direita da tela de login*/
    <div className="flex w-full h-screen animate-in fade-in">
      <div className="hidden lg:flex w-1/2 bg-[#001b4e] rounded-r-[80px] flex-col items-center justify-center text-white p-12">
        <img src={logoClara} alt="Logo da Biblioteca" className="w-64 mb-8" />
        <p className="text-lg mb-8 text-center leading-relaxed">
          Já tem uma conta? <br /> Então entre.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-[#001b4e] px-16 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001b4e]"
        >
          ENTRAR
        </button>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-xl flex flex-col items-center">
          <img
            src={logoEscura}
            alt="Logo da Biblioteca"
            className="w-40 mb-6"
          />
          <p className="mb-8 text-gray-600 font-medium">
            Forneça suas informações para se cadastrar.
          </p>

          <form
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome{" "}
                <span className="text-red-500" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Nome"
                disabled={isLoading}
                className={`w-full border ${
                  errors.nome
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } p-3 rounded-xl outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? "nome-error" : undefined}
                required
              />
              {errors.nome && (
                <p
                  id="nome-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.nome}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sobrenome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sobrenome{" "}
                <span className="text-red-500" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="sobrenome"
                name="sobrenome"
                type="text"
                value={formData.sobrenome}
                onChange={(e) => handleChange("sobrenome", e.target.value)}
                placeholder="Sobrenome"
                disabled={isLoading}
                className={`w-full border ${
                  errors.sobrenome
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } p-3 rounded-xl outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                aria-invalid={!!errors.sobrenome}
                aria-describedby={
                  errors.sobrenome ? "sobrenome-error" : undefined
                }
                required
              />
              {errors.sobrenome && (
                <p
                  id="sobrenome-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.sobrenome}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefone{" "}
                <span className="text-red-500" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={isLoading}
                className={`w-full border ${
                  errors.telefone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } p-3 rounded-xl outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                aria-invalid={!!errors.telefone}
                aria-describedby={
                  errors.telefone ? "telefone-error" : undefined
                }
                required
              />
              {errors.telefone && (
                <p
                  id="telefone-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.telefone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email{" "}
                <span className="text-red-500" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
                className={`w-full border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } p-3 rounded-xl outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuário{" "}
                <span className="text-red-500" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                value={formData.usuario}
                onChange={(e) => handleChange("usuario", e.target.value)}
                placeholder="Usuário"
                disabled={isLoading}
                className={`w-full border ${
                  errors.usuario
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } p-3 rounded-xl outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                aria-invalid={!!errors.usuario}
                aria-describedby={errors.usuario ? "usuario-error" : undefined}
                required
              />
              {errors.usuario && (
                <p
                  id="usuario-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.usuario}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha{" "}
                <span className="text-red-500" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
                className={`w-full border ${
                  errors.senha
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } p-3 rounded-xl outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                aria-invalid={!!errors.senha}
                aria-describedby={errors.senha ? "senha-error" : undefined}
                minLength={6}
                required
              />
              {errors.senha && (
                <p
                  id="senha-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.senha}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="col-span-1 md:col-span-2 bg-[#001b4e] text-white py-3 rounded-xl font-bold mt-4 shadow-md hover:bg-[#002a6e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Cadastrando...
                </>
              ) : (
                "CADASTRAR"
              )}
            </button>
          </form>

          {/* Link para login em mobile */}
          <div className="mt-6 lg:hidden text-center">
            <p className="text-gray-500 mb-2">Já tem uma conta?</p>
            <button
              onClick={() => navigate("/login")}
              disabled={isLoading}
              className="text-[#001b4e] font-bold underline hover:text-[#002a6e] transition-colors"
            >
              Entre agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
