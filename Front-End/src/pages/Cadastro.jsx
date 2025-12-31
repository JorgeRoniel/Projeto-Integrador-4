import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Cadastro({ logoEscura, logoClara }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        telefone: '',
        email: '',
        usuario: '',
        senha: ''
    });
    const [errors, setErrors] = useState({});

    const validarEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validarTelefone = (telefone) => {
        // Remove caracteres não numéricos para validação
        const apenasNumeros = telefone.replace(/\D/g, '');
        return apenasNumeros.length >= 10;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validação de campos obrigatórios
        if (!formData.nome.trim()) {
            newErrors.nome = 'O nome é obrigatório';
        }

        if (!formData.sobrenome.trim()) {
            newErrors.sobrenome = 'O sobrenome é obrigatório';
        }

        if (!formData.telefone.trim()) {
            newErrors.telefone = 'O telefone é obrigatório';
        } else if (!validarTelefone(formData.telefone)) {
            newErrors.telefone = 'Telefone inválido. Deve ter pelo menos 10 dígitos';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'O email é obrigatório';
        } else if (!validarEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.usuario.trim()) {
            newErrors.usuario = 'O usuário é obrigatório';
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
        toast.success('Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 500);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpa o erro quando o usuário começa a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        /*Tela de cadastro caso clique no botão a direita da tela de login*/
        <div className="flex w-full h-screen animate-in fade-in">
            <div className="hidden lg:flex w-1/2 bg-[#001b4e] rounded-r-[80px] flex-col items-center justify-center text-white p-12">
                <img src={logoClara} alt="Logo da Biblioteca" className="w-64 mb-8" />
                <p className="text-lg mb-8 text-center leading-relaxed">Já tem uma conta? <br /> Então entre.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-[#001b4e] px-16 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001b4e]"
                >
                    ENTRAR
                </button>
            </div>

            <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-xl flex flex-col items-center">
                    <img src={logoEscura} alt="Logo da Biblioteca" className="w-40 mb-6" />
                    <p className="mb-8 text-gray-600 font-medium">Forneça suas informações para se cadastrar.</p>

                    <form className="w-full grid grid-cols-2 gap-4" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                value={formData.nome}
                                onChange={(e) => handleChange('nome', e.target.value)}
                                placeholder="Nome"
                                className={`w-full border ${errors.nome ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} p-3 rounded-xl outline-none focus:ring-2 transition-colors`}
                                aria-invalid={!!errors.nome}
                                aria-describedby={errors.nome ? 'nome-error' : undefined}
                                required
                            />
                            {errors.nome && (
                                <p id="nome-error" className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.nome}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700 mb-1">
                                Sobrenome <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="sobrenome"
                                name="sobrenome"
                                type="text"
                                value={formData.sobrenome}
                                onChange={(e) => handleChange('sobrenome', e.target.value)}
                                placeholder="Sobrenome"
                                className={`w-full border ${errors.sobrenome ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} p-3 rounded-xl outline-none focus:ring-2 transition-colors`}
                                aria-invalid={!!errors.sobrenome}
                                aria-describedby={errors.sobrenome ? 'sobrenome-error' : undefined}
                                required
                            />
                            {errors.sobrenome && (
                                <p id="sobrenome-error" className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.sobrenome}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                value={formData.telefone}
                                onChange={(e) => handleChange('telefone', e.target.value)}
                                placeholder="(11) 99999-9999"
                                className={`w-full border ${errors.telefone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} p-3 rounded-xl outline-none focus:ring-2 transition-colors`}
                                aria-invalid={!!errors.telefone}
                                aria-describedby={errors.telefone ? 'telefone-error' : undefined}
                                required
                            />
                            {errors.telefone && (
                                <p id="telefone-error" className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.telefone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="seu@email.com"
                                className={`w-full border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} p-3 rounded-xl outline-none focus:ring-2 transition-colors`}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                required
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuário <span className="text-red-500" aria-label="obrigatório">*</span>
                            </label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                value={formData.usuario}
                                onChange={(e) => handleChange('usuario', e.target.value)}
                                placeholder="Usuário"
                                className={`w-full border ${errors.usuario ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} p-3 rounded-xl outline-none focus:ring-2 transition-colors`}
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
                                placeholder="Mínimo 6 caracteres"
                                className={`w-full border ${errors.senha ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#001b4e]'} p-3 rounded-xl outline-none focus:ring-2 transition-colors`}
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
                            type="submit"
                            className="col-span-2 bg-[#001b4e] text-white py-3 rounded-xl font-bold mt-4 shadow-md hover:bg-[#002a6e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2"
                        >
                            CADASTRAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;