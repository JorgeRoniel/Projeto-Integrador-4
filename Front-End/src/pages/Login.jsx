import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Login({ logoEscura, logoClara }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ usuario: '', senha: '' });
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validação de campos obrigatórios
        if (!formData.usuario.trim()) {
            newErrors.usuario = 'O nome de usuário é obrigatório';
        }

        if (!formData.senha) {
            newErrors.senha = 'A senha é obrigatória';
        } else if (formData.senha.length < 6) {
            newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Por favor, corrija os erros no formulário');
            return;
        }

        // Se passou na validação
        toast.success('Login realizado com sucesso!');
        setTimeout(() => navigate('/catalogo'), 500);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpa o erro quando o usuário começa a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        /*Tela de login(A tela que nos iniciamos)*/
        <div className="flex w-full h-screen animate-in fade-in duration-500">
            <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
                <div className="flex w-full max-w-md flex-col items-center text-[#001b4e]">
                    <img src={logoEscura} alt="Logo da Biblioteca" className="w-48 h-48 object-contain mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
                    <p className="text-gray-500 mb-8">Por favor coloque suas informações de login</p>

                    <form className="w-full space-y-4" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome de usuário <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                value={formData.usuario}
                                onChange={(e) => handleChange('usuario', e.target.value)}
                                placeholder="Digite seu nome de usuário"
                                className={`w-full rounded-xl border ${errors.usuario ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} px-4 py-3 outline-none focus:ring-2 transition-colors`}
                                aria-invalid={!!errors.usuario}
                                aria-describedby={errors.usuario ? 'usuario-error' : undefined}
                                required
                            />
                            {errors.usuario && (
                                <p id="usuario-error" className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.usuario}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                                Senha <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                value={formData.senha}
                                onChange={(e) => handleChange('senha', e.target.value)}
                                placeholder="Digite sua senha"
                                className={`w-full rounded-xl border ${errors.senha ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} px-4 py-3 outline-none focus:ring-2 transition-colors`}
                                aria-invalid={!!errors.senha}
                                aria-describedby={errors.senha ? 'senha-error' : undefined}
                                minLength={6}
                                required
                            />
                            {errors.senha && (
                                <p id="senha-error" className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.senha}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/recuperar-senha')}
                            className="text-sm underline text-gray-500 block hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2 rounded"
                        >
                            Esqueceu sua senha?
                        </button>

                        <button
                            type="submit"
                            className="w-full bg-[#001b4e] text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-[#002a6e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2"
                        >
                            ENTRAR
                        </button>
                    </form>
                </div>
            </div>
            <div className="hidden lg:flex w-1/2 bg-[#001b4e] rounded-l-[80px] flex-col items-center justify-center text-white">
                <img src={logoClara} alt="Logo da Biblioteca" className="w-64 mb-8" />
                <p className="text-lg mb-8">Novo na nossa plataforma? Cadastre-se agora.</p>
                <button
                    onClick={() => navigate('/cadastro')}
                    className="bg-white text-[#001b4e] px-16 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001b4e]"
                >
                    CADASTRAR
                </button>
            </div>
        </div>
    );
}

export default Login;