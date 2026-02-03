import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { recoverPassword } from '../services/api';

function RecuperarSenha({ logoEscura }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validarEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
        setError('O email é obrigatório');
        toast.error('Por favor, insira seu email');
        return;
    }

    if (!validarEmail(email)) {
        setError('Email inválido');
        toast.error('Por favor, insira um email válido');
        return;
    }

    setIsLoading(true);
    try {
        await recoverPassword(email);
        toast.success('Se o e-mail existir, o link de recuperação foi enviado!');
        setTimeout(() => navigate('/confirmacao'), 2000);
    } catch (err) {
        toast.error(err.message || 'Erro ao processar solicitação');
        setIsLoading(false);
    }
};

    const handleChange = (value) => {
        setEmail(value);
        if (error) {
            setError('');
        }
    };

    return (
        /*Tela de recuperar senha caso a pessoa clique em esqueci minha senha*/
        <div className="flex w-full h-screen flex-col items-center justify-center animate-in fade-in">
            <img src={logoEscura} alt="Logo da Biblioteca" className="w-48 mb-8" />
            <h1 className="text-3xl font-bold mb-4 text-[#001b4e]">Recuperar Senha</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
                <div>
                    <label htmlFor="email-recuperacao" className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500" aria-label="obrigatório">*</span>
                    </label>
                    <input
                        id="email-recuperacao"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        disabled={isLoading}
                        placeholder="Digite seu email cadastrado"
                        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} p-3 rounded-xl mb-2 outline-none focus:ring-2 transition-all disabled:bg-gray-100`}
                    />
                    {error && (
                        <p id="email-error" className="mb-4 text-sm text-red-500" role="alert">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#001b4e] text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-[#002a6e] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            ENVIANDO...
                        </>
                    ) : (
                        'ENVIAR LINK'
                    )}
                </button>
            </form>

            <button
                onClick={() => navigate('/login')}
                disabled={isLoading}
                className="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2 rounded px-2 py-1"
            >
                <ArrowLeft size={16} /> Voltar
            </button>
        </div>
    );
}

export default RecuperarSenha;