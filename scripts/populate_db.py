import requests
import base64
import random
import time

BASE_URL = "http://localhost:8080/api"

def get_base64_image(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            return base64.b64encode(response.content).decode('utf-8')
    except Exception as e:
        print(f"Erro ao baixar imagem: {e}")
    return None

def register_user(username, nome, email, senha, telefone, role="USER"):
    url = f"{BASE_URL}/user/register"
    data = {
        "username": username,
        "nome": nome,
        "email": email,
        "senha": senha,
        "telefone": telefone,
        "role": role
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print(f"✅ Usuário {username} registrado!")
            return True
        elif response.status_code == 409:
             print(f"⚠️ Usuário {username} já existe.")
             return True # Consideramos sucesso para continuar
        else:
            print(f"❌ Erro ao registrar {username}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro de conexão ao registrar {username}: {e}")
        return False

def login(email, senha):
    url = f"{BASE_URL}/user/login"
    data = {"email": email, "senha": senha}
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Erro ao logar {email}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro de conexão ao logar {email}: {e}")
        return None

def add_book(token, book_data):
    url = f"{BASE_URL}/book"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Clone data to avoid modifying original
    data_to_send = book_data.copy()

    # Process image if it's a URL
    if 'imagem_url' in data_to_send:
        print(f"   Baixando capa de '{data_to_send['titulo']}'...")
        image_b64 = get_base64_image(data_to_send['imagem_url'])
        if image_b64:
             del data_to_send['imagem_url']
             data_to_send['imagem'] = image_b64
        else:
             print("   ⚠️ Falha ao baixar imagem, enviando sem.")
             del data_to_send['imagem_url']

    try:
        response = requests.post(url, json=data_to_send, headers=headers)
        if response.status_code == 201:
            # CORREÇÃO: Backend retorna id_livro, nao id
            book_id = response.json().get('id_livro')
            print(f"✅ Livro '{data_to_send['titulo']}' adicionado! ID: {book_id}")
            return book_id, data_to_send['titulo']
        else:
            print(f"❌ Erro ao adicionar livro '{data_to_send['titulo']}': {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Erro de conexão ao adicionar livro: {e}")
        return None, None

def rate_book(token, book_id, user_id, nota, comentario):
    url = f"{BASE_URL}/book/{book_id}/rating"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "user_id": user_id,
        "nota": nota,
        "comentario": comentario
    }
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 200:
            print(f"   ⭐ Avaliação enviada!")
        else:
            print(f"   ❌ Erro ao avaliar: {response.text}")
    except Exception as e:
        print(f"   ❌ Erro de conexão ao avaliar: {e}")

# --- DATASETS ---

ADMIN = {"username": "admin", "nome": "Administrador", "email": "admin@email.com", "senha": "admin123", "telefone": "999999999", "role": "ADMIN"}

USERS = [
    {"username": "leitor_vip", "nome": "Ricardo Souza", "email": "ricardo@email.com", "senha": "123", "telefone": "111111111", "role": "USER"},
    {"username": "nanda_lima", "nome": "Fernanda Lima", "email": "fernanda@email.com", "senha": "123", "telefone": "222222222", "role": "USER"},
    {"username": "potterhead", "nome": "Potter Head", "email": "potter@email.com", "senha": "123", "telefone": "333333333", "role": "USER"},
    {"username": "gandalf_fan", "nome": "Gandalf O Cinzento", "email": "gandalf@email.com", "senha": "123", "telefone": "444444444", "role": "USER"},
    {"username": "dev_senior", "nome": "Dev Senior", "email": "dev@email.com", "senha": "123", "telefone": "555555555", "role": "USER"},
    {"username": "estudante_js", "nome": "Estudante JS", "email": "js@email.com", "senha": "123", "telefone": "666666666", "role": "USER"},
]

BOOKS = [
    {
        "titulo": "The Black Wolf",
        "autor": "L. J. Smith",
        "edicao": "1a Edição",
        "ano_publicacao": 2020,
        "editora": "Editora Fantasia",
        "categorias": ["Fantasia", "Suspense"],
        "descricao": "Um lobo solitário vaga pela floresta encantada em busca de redenção.",
        "imagem_url": "https://images.unsplash.com/photo-1614726365723-49cfaacf560b?q=80&w=800&auto=format&fit=crop"
    },
    {
        "titulo": "Harry Potter e a Pedra Filosofal",
        "autor": "J.K. Rowling",
        "edicao": "1a Edição",
        "ano_publicacao": 1997,
        "editora": "Rocco",
        "categorias": ["Fantasia", "Aventura"],
        "descricao": "A história do menino que sobreviveu e descobriu ser um bruxo no seu aniversário de 11 anos.",
        "imagem_url": "https://images.unsplash.com/photo-1626618012641-bf8ca5564394?q=80&w=800&auto=format&fit=crop"
    },
    {
        "titulo": "O Senhor dos Anéis",
        "autor": "J.R.R. Tolkien",
        "edicao": "2a Edição",
        "ano_publicacao": 1954,
        "editora": "Martins Fontes",
        "categorias": ["Fantasia", "Épico"],
        "descricao": "Uma jornada épica pela Terra Média para destruir o Um Anel.",
        "imagem_url": "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=800&auto=format&fit=crop"
    },
    {
        "titulo": "Clean Code",
        "autor": "Robert C. Martin",
        "edicao": "1a Edição",
        "ano_publicacao": 2008,
        "editora": "Alta Books",
        "categorias": ["Tecnologia", "Programação"],
        "descricao": "Como escrever código limpo e manutenível. Leitura obrigatória para devs.",
        "imagem_url": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop" # Generic code book
    }
]

# Map de avaliações: Chave é parte do título do livro, valor é lista de (username_key, nota, comentario)
SCENARIO_RATINGS = {
    "The Black Wolf": [
        ("leitor_vip", 5, "Que suspense incrível! Armand Gamache nunca decepciona."),
        ("nanda_lima", 4, "Muito bom, mas o meio do livro é um pouco lento.")
    ],
    "Harry Potter": [
        ("potterhead", 5, "Um clássico eterno. Hogwarts é meu lar."),
        ("estudante_js", 5, "Melhor livro infantil já escrito."),
        ("nanda_lima", 5, "Reli pela décima vez e continua mágico.")
    ],
    "Senhor dos Anéis": [
        ("gandalf_fan", 5, "A obra prima da fantasia. Tolkien é gênio.")
    ],
    "Clean Code": [
        ("dev_senior", 5, "Todo programador deveria ler. Mudou minha carreira."),
        ("estudante_js", 3, "Conteúdo ótimo, mas os exemplos em Java são difíceis pra quem só sabe JS.")
    ]
}

def main():
    print("=== POPULANDO BANCO DE DADOS PARA APRESENTAÇÃO ===\n")
    
    # 1. Registrar Admin
    print("[1] Configurando Admin...")
    register_user(**ADMIN)
    admin_login = login(ADMIN["email"], ADMIN["senha"])
    if not admin_login:
        print("❌ Falha crítica no login do admin.")
        return
    admin_token = admin_login.get("token")

    # 2. Adicionar Livros e Guardar IDs
    print("\n[2] Cadastrando Livros...")
    book_map = {} # titulo -> id
    for book in BOOKS:
        bid, titulo = add_book(admin_token, book)
        if bid:
            book_map[titulo] = bid

    # 3. Registrar Usuários e Guardar Tokens
    print("\n[3] Criando Usuários da Comunidade...")
    user_tokens = {} # username -> {id, token}
    for u in USERS:
        register_user(**u)
        login_data = login(u["email"], u["senha"])
        if login_data:
            user_tokens[u["username"]] = {
                "id": login_data.get("user_id") or login_data.get("id"), # Try both just in case
                "token": login_data.get("token")
            }

    # 4. Adicionar Avaliações do Cenário
    print("\n[4] Inserindo Comentários e Avaliações Reais...")
    for book_title_key, reviews in SCENARIO_RATINGS.items():
        # Achar ID do livro pelo título (partial match)
        target_bid = None
        for saved_title, saved_id in book_map.items():
            if book_title_key in saved_title:
                target_bid = saved_id
                break
        
        if not target_bid:
            print(f"⚠️ Livro não encontrado para chave '{book_title_key}'")
            continue

        print(f"📝 Avaliando '{book_title_key}' (ID: {target_bid})...")
        for username, nota, comentario in reviews:
            user_info = user_tokens.get(username)
            if user_info:
                rate_book(user_info["token"], target_bid, user_info["id"], nota, comentario)
            else:
                print(f"   ⚠️ Usuário '{username}' não encontrado para avaliar.")

    print("\n=== SCRIPT FINALIZADO COM SUCESSO! ===")
    print("Agora você pode rodar este script e sua apresentação terá dados lindos! 🚀")

if __name__ == "__main__":
    main()
