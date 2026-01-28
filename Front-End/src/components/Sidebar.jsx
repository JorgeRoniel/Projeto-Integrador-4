import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Heart,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ logoClara }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // Itens do menu principal
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "catalogo", label: "Catálogo", icon: Compass, path: "/catalogo" },
    {
      id: "meus-livros",
      label: "Meus livros",
      icon: BookOpen,
      path: "/meus-livros",
    },
    {
      id: "lista-desejo",
      label: "Lista de desejo",
      icon: Heart,
      path: "/lista-desejo",
    },
  ];

  // Função de logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-[#001b4e] h-screen sticky top-0 flex flex-col p-6 text-white shrink-0">
      <Link to="/catalogo">
        <img
          src={logoClara}
          alt="Logo"
          className="w-32 mb-12 self-center cursor-pointer"
        />
      </Link>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
              location.pathname === item.path
                ? "bg-white text-[#001b4e] font-bold shadow-lg"
                : "hover:bg-white/10"
            }`}
          >
            <item.icon size={20} /> {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/20 pt-6 space-y-4">
        {/* Opção de Admin - só aparece se o usuário for ADMIN */}
        {isAdmin() && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all ${
              location.pathname === "/admin"
                ? "bg-yellow-500 text-[#001b4e] font-bold"
                : "text-yellow-400 hover:bg-white/10"
            }`}
          >
            <Shield size={18} /> Administração
          </Link>
        )}

        <Link
          to="/perfil"
          className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-sm ${
            location.pathname === "/perfil"
              ? "bg-white text-[#001b4e] font-bold"
              : "hover:text-gray-300"
          }`}
        >
          <User size={18} /> Perfil
        </Link>

        {/* Mostra o nome do usuário se estiver logado */}
        {user && (
          <p className="text-xs text-gray-400 px-2 truncate">
            Logado como: {user.nome || user.username}
          </p>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-2 text-red-400 hover:text-red-300 transition-colors text-sm"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
