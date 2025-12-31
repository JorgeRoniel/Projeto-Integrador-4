import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Confirmacao() {
    const navigate = useNavigate();
    return (
        /*Tela de confirmação de que o email foi enviado para o email de quem está tentando recuperar a senha*/
        <div className="flex w-full h-screen flex-col items-center justify-center animate-in zoom-in">
            <div className="bg-white p-12 rounded-[40px] shadow-2xl flex flex-col items-center text-center max-w-md border border-gray-100">
                <CheckCircle2 size={80} className="text-green-500 mb-6" aria-hidden="true" />
                <h1 className="text-3xl font-bold text-[#001b4e] mb-2">Email enviado!</h1>
                <p className="text-gray-600 mb-6">Verifique sua caixa de entrada para redefinir sua senha.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-[#001b4e] text-white py-3 rounded-xl font-bold mt-6 hover:bg-[#002a6e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#001b4e] focus:ring-offset-2"
                >
                    ENTENDI
                </button>
            </div>
        </div>
    );
}

export default Confirmacao;