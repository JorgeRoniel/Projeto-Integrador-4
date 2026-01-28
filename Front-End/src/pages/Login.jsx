import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login({ logoEscura, logoClara }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validação de campos obrigatórios
    if (!formData.email.trim()) {
      newErrors.email = "O email é obrigatório";
    } else if (!validarEmail(formData.email)) {
      newErrors.email = "Email inválido";
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

    // Chama a API de login
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.senha);

      if (result.success) {
        toast.success(`Bem-vindo, ${result.user.nome}!`);
        setTimeout(() => navigate("/catalogo"), 500);
      } else {
        toast.error(result.error || "Email ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro no login:", error);
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
    /*Tela de login(A tela que nos iniciamos)*/
    <div className="flex w-full h-screen animate-in fade-in duration-500">
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="flex w-full max-w-md flex-col items-center text-[#001b4e]">
          <img
            src={logoEscura}
            alt="Logo da Biblioteca"
            className="w-48 h-48 object-contain mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
          <p className="text-gray-500 mb-8">
            Por favor coloque suas informações de login
          </p>

          <form className="w-full space-y-4" onSubmit={handleSubmit} noValidate>
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
                placeholder="Digite seu email"
                disabled={isLoading}
                className={`w-full rounded-xl border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } px-4 py-3 outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
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
                placeholder="Digite sua senha"
                disabled={isLoading}
                className={`w-full rounded-xl border ${
                  errors.senha
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#001b4e]"
                } px-4 py-3 outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
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
              type="button"
              onClick={() => navigate("/recuperar-senha")}
              disabled={isLoading}
              className="text-sm underline text-gray-500 block hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2 rounded disabled:cursor-not-allowed"
            >
              Esqueceu sua senha?
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#001b4e] text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-[#002a6e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Entrando...
                </>
              ) : (
                "ENTRAR"
              )}
            </button>
          </form>

          {/* Link para cadastro em mobile */}
          <div className="mt-6 lg:hidden text-center">
            <p className="text-gray-500 mb-2">Novo na nossa plataforma?</p>
            <button
              onClick={() => navigate("/cadastro")}
              disabled={isLoading}
              className="text-[#001b4e] font-bold underline hover:text-[#002a6e] transition-colors"
            >
              Cadastre-se agora
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#001b4e] rounded-l-[80px] flex-col items-center justify-center text-white">
        <img src={logoClara} alt="Logo da Biblioteca" className="w-64 mb-8" />
        <p className="text-lg mb-8">
          Novo na nossa plataforma? Cadastre-se agora.
        </p>
        <button
          onClick={() => navigate("/cadastro")}
          className="bg-white text-[#001b4e] px-16 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001b4e]"
        >
          CADASTRAR
        </button>
      </div>
    </div>
  );
}

export default Login;
