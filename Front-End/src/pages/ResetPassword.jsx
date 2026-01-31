import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordFinal } from '../services/api';
import toast from 'react-hot-toast';
import { LockKeyhole, Loader2 } from 'lucide-react';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [novaSenha, setNovaSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token de recuperação ausente!");
            return;
        }

        if (!novaSenha) {
            toast.error("A senha é obrigatória");
            return;
        } else if (novaSenha.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        setIsLoading(true);
        try {
            await resetPasswordFinal(token, novaSenha); 
            toast.success("Senha alterada com sucesso!");
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Erro ao redefinir senha.");
            setIsLoading(false);
        }
    };

   return (
        <div className="flex w-full h-screen flex-col items-center justify-center animate-in zoom-in bg-gray-50">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center text-center w-full max-w-md border border-gray-100">
                
                <div className="bg-[#f0f4ff] p-4 rounded-full mb-6">
                    <LockKeyhole size={40} className="text-[#001b4e]" />
                </div>

                <h1 className="text-3xl font-bold text-[#001b4e] mb-2">Nova Senha</h1>
                <p className="text-gray-500 mb-8">Crie uma senha forte de pelo menos 6 caracteres.</p>

                <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                            Sua nova senha
                        </label>
                        <input 
                            type="password" 
                            disabled={isLoading}
                            placeholder="Digite a nova senha"
                            className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#001b4e] transition-all"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#001b4e] text-white p-4 rounded-xl font-bold hover:bg-[#002a6e] shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                PROCESSANDO...
                            </>
                        ) : (
                            'ATUALIZAR SENHA'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;