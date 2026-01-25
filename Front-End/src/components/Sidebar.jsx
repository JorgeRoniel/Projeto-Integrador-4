import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Heart,
  User,
  LogOut,
} from "lucide-react";

const Sidebar = ({ logoClara }) => {
  const location = useLocation();

  //Aqui é onde temos a sidebar com os icones após o login/criação de conta(os icones são da biblioteca lucide react)
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
        <Link
          to="/perfil"
          className="flex items-center gap-3 w-full p-2 hover:text-gray-300 transition-colors text-sm"
        >
          <User size={18} /> Perfil
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-3 w-full p-2 text-red-400 hover:text-red-300 transition-colors text-sm"
        >
          <LogOut size={18} /> Sair
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;
