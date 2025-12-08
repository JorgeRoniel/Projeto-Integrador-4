import React from "react";
import './login.css';
import logoImage from "../assets/logo.png";

function Login() {
    return (
        <div className="login-container">
            {/* Coluna Esquerda - Login */}
            <div className="login-left">
                <div className="login-content">
                    {/* Logo */}
                    <div className="logo">
                        <img src={logoImage} alt="Library Logo" />
                        <span>LIBRARY</span>
                    </div>

                    {/* Título */}
                    <h1 className="titulo">Bem-vindo!</h1>
                    <p className="subtitulo">Por favor coloque suas credenciais</p>
                    {/* Formulário */}
                    <form className="form-login">
                        <input type="text" placeholder="Nome" className="input-field" />
                        <input type="password" placeholder="Senha" className="input-field" />
                        <a href="#" className="esqueceu-senha">Esqueceu sua senha?</a>
                        <button type="submit" className="btn-entrar">Entrar</button>
                    </form>
                </div>
            </div>
            {/* Coluna Direita - Login */}
            <div className="login-right">
                <h1>Coluna Direita - Login</h1>

            </div>
        </div >
    )
}

export default Login