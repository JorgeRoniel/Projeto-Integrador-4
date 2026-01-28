const fetch = require('node-fetch');

const API_URL = 'http://localhost:8080/api';

const books = [
    {
        titulo: "Batman: The Dark Knight Returns",
        autor: "Frank Miller",
        editora: "DC Comics",
        edicao: "1",
        ano_publicacao: 1986,
        categorias: ["Quadrinhos", "Ação"],
        descricao: "Uma obra prima das HQs.",
        imagem: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=600&fit=crop"
    },
    {
        titulo: "Os Sete Maridos de Evelyn Hugo",
        autor: "Taylor Jenkins Reid",
        editora: "Paralela",
        edicao: "1",
        ano_publicacao: 2017,
        categorias: ["Ficção", "Drama"],
        descricao: "A história de uma estrela de Hollywood.",
        imagem: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
    },
    {
        titulo: "O Senhor dos Anéis: A Sociedade do Anel",
        autor: "J.R.R. Tolkien",
        editora: "HarperCollins",
        edicao: "1",
        ano_publicacao: 1954,
        categorias: ["Fantasia", "Aventura"],
        descricao: "O início da jornada para destruir o Um Anel.",
        imagem: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop"
    },
    {
        titulo: "1984",
        autor: "George Orwell",
        editora: "Companhia das Letras",
        edicao: "1",
        ano_publicacao: 1949,
        categorias: ["Ficção", "Distopia"],
        descricao: "O Grande Irmão está de olho em você.",
        imagem: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
    },
    {
        titulo: "Harry Potter e a Pedra Filosofal",
        autor: "J.K. Rowling",
        editora: "Rocco",
        edicao: "1",
        ano_publicacao: 1997,
        categorias: ["Fantasia", "Infantil"],
        descricao: "O menino que sobreviveu.",
        imagem: "https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400&h=600&fit=crop"
    }
];

async function populate() {
    console.log("Iniciando população do banco de dados...");

    // 1. Criar usuário ADMIN (ou usar existente) - Simplificando, tentaremos cadastrar os livros direto.
    // Se precisar de auth, teríamos que logar primeiro. Mas se o endpoint de criar livro for aberto (ou se usarmos o workaround de dev), ok.
    // Verificando WebSecurityConfig: POST /api/book requestMatchers não está explícito como permitAll, então precisa de Auth.

    // Vamos criar um admin temp
    const adminUser = {
        username: "admin_seed",
        nome: "Admin Seeder",
        email: "admin@seed.com",
        senha: "password123",
        telefone: "11999999999",
        role: "ADMIN"
    };

    try {
        console.log("Criando usuário admin...");
        await fetch(`${API_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminUser)
        });

        console.log("Logando como admin...");
        const loginRes = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminUser.email, senha: adminUser.senha })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;

        if (!token) {
            console.error("Falha ao obter token de admin. Verifique se o backend está rodando.");
            return;
        }

        console.log("Token obtido. Cadastrando livros...");

        for (const book of books) {
            // Converter imagem URL para Base64 (simulação simples, backend espera byte[] ou string base64)
            // Para simplificar, enviaremos a URL no campo imagem se o backend aceitar string, 
            // mas o DTO pede byte[]. Vamos tentar enviar null ou string se o serializer permitir.
            // Se falhar, o usuário verá sem capa, mas o livro estará lá.

            const res = await fetch(`${API_URL}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...book,
                    imagem: [] // Enviando array de bytes vazio para não quebrar o parser Java
                })
            });

            if (res.ok) {
                console.log(`Livro "${book.titulo}" cadastrado!`);
            } else {
                console.error(`Erro ao cadastrar "${book.titulo}": ${res.status}`);
            }
        }

        console.log("\nConcluído! Recarregue a página do Catálogo.");

    } catch (error) {
        console.error("Erro na execução:", error);
    }
}

populate();
