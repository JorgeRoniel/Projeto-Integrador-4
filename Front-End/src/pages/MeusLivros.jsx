import React from "react";
import BookCard from "../components/BookCard";

function MeusLivros() {
// Dados mockados dos livros do usuário
const meusLivros = [
    {
      id: 1,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      avaliacao: 5
    },
    {
      id: 2,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      avaliacao: 4
    },
    {
      id: 3,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      avaliacao: 3
    },
    {
      id: 4,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      avaliacao: 4
    },
    {
      id: 5,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      avaliacao: 3
    },
    {
      id: 6,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
      avaliacao: 4
    },
    {
      id: 7,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
      avaliacao: 5
    },
    {
      id: 8,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      avaliacao: 4
    },
    {
      id: 9,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
      avaliacao: 4
    },
    {
      id: 10,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
      avaliacao: 3
    },
    {
      id: 11,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400&h=600&fit=crop",
      avaliacao: 4
    },
    {
      id: 12,
      titulo: "Anne de Green Gables",
      autor: "L.M. Montgomery",
      capa: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      avaliacao: 3
    }
  ];
 
    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#001b4e] mb-8">Meus Livros</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
                {meusLivros.map((livro) => (
                    <BookCard key={livro.id} livro={livro} />
                ))}
            </div>
        </div>
    );
}

export default MeusLivros;