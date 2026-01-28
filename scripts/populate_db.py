import requests
import base64
import random
import time

BASE_URL = "http://localhost:8080/api"

def get_base64_image(url):
    try:
        response = requests.get(url)
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
            print(f"Usuário {username} registrado com sucesso!")
            return True
        else:
            print(f"Erro ao registrar {username}: {response.text}")
            return False
    except Exception as e:
        print(f"Erro de conexão ao registrar {username}: {e}")
        return False

def login(email, senha):
    url = f"{BASE_URL}/user/login"
    data = {"email": email, "senha": senha}
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Erro ao logar {email}: {response.text}")
            return None
    except Exception as e:
        print(f"Erro de conexão ao logar {email}: {e}")
        return None

def add_book(token, book_data):
    url = f"{BASE_URL}/book"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Process image if it's a URL
    if 'imagem_url' in book_data:
        image_b64 = get_base64_image(book_data['imagem_url'])
        if image_b64:
             # O backend espera 'imagem' como byte array, mas em JSON enviamos como string Base64
             del book_data['imagem_url']
             book_data['imagem'] = image_b64
        else:
            # Se falhar, remove ou usa placeholder (depende da validação do back)
             del book_data['imagem_url']
             # book_data['imagem'] = [] # Enviando vazio se falhar

    try:
        response = requests.post(url, json=book_data, headers=headers)
        if response.status_code == 201:
            book_id = response.json().get('id')
            print(f"Livro '{book_data['titulo']}' adicionado! ID: {book_id}")
            return book_id
        else:
            print(f"Erro ao adicionar livro '{book_data['titulo']}': {response.text}")
            return None
    except Exception as e:
        print(f"Erro de conexão ao adicionar livro: {e}")
        return None

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
            print(f"Avaliação enviada para livro {book_id}!")
        else:
            print(f"Erro ao avaliar livro {book_id}: {response.text}")
    except Exception as e:
        print(f"Erro ao avaliar: {e}")

# --- DATA ---

admins = [
    {"username": "admin", "nome": "Administrador", "email": "admin@email.com", "senha": "admin", "telefone": "999999999", "role": "ADMIN"}
]

users = [
    {"username": "leitor1", "nome": "Alice Leitora", "email": "alice@email.com", "senha": "123", "telefone": "888888888", "role": "USER"},
    {"username": "leitor2", "nome": "Bob Leitor", "email": "bob@email.com", "senha": "123", "telefone": "777777777", "role": "USER"},
    {"username": "critico", "nome": "Carlos Crítico", "email": "carlos@email.com", "senha": "123", "telefone": "666666666", "role": "USER"},
]

books = [
    {
        "titulo": "The Black Wolf",
        "autor": "L. J. Smith",
        "edicao": "1a Edição",
        "ano_publicacao": 2020,
        "editora": "Editora Fantasia",
        "categorias": ["Fantasia", "Suspense"],
        "descricao": "Um lobo solitário vaga pela floresta encantada em busca de redenção.",
        "imagem_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
    },
    {
        "titulo": "Harry Potter e a Pedra Filosofal",
        "autor": "J.K. Rowling",
        "edicao": "1a Edição",
        "ano_publicacao": 1997,
        "editora": "Rocco",
        "categorias": ["Fantasia", "Aventura"],
        "descricao": "A história do menino que sobreviveu e descobriu ser um bruxo.",
        "imagem_url": "https://images.unsplash.com/photo-1626618012641-bf8ca5564394?q=80&w=800&auto=format&fit=crop"
    },
    {
        "titulo": "O Senhor dos Anéis: A Sociedade do Anel",
        "autor": "J.R.R. Tolkien",
        "edicao": "2a Edição",
        "ano_publicacao": 1954,
        "editora": "Martins Fontes",
        "categorias": ["Fantasia", "Épico"],
        "descricao": "Uma jornada épica para destruir o Um Anel e salvar a Terra Média.",
        "imagem_url": "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=800&auto=format&fit=crop"
    },
    {
        "titulo": "Clean Code",
        "autor": "Robert C. Martin",
        "edicao": "1a Edição",
        "ano_publicacao": 2008,
        "editora": "Alta Books",
        "categorias": ["Tecnologia", "Programação"],
        "descricao": "Como escrever código limpo e manutenível.",
        "imagem_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop"
    },
     {
        "titulo": "O Pequeno Príncipe",
        "autor": "Antoine de Saint-Exupéry",
        "edicao": "3a Edição",
        "ano_publicacao": 1943,
        "editora": "Agir",
        "categorias": ["Infantil", "Filosofia"],
        "descricao": "Um piloto cai no deserto do Saara e encontra um jovem príncipe que viaja de planeta em planeta.",
        "imagem_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
    }
]

comments = [
    "Livro incrível, recomendo muito!",
    "Achei um pouco entediante no começo, mas depois melhora.",
    "Um clássico indispensável.",
    "Não gostei do final.",
    "Excelente leitura para o fim de semana.",
    "A escrita do autor é fenomenal."
]

def main():
    print("=== POPULANDO BANCO DE DADOS ===")
    
    # 1. Registrar Admin
    print("\n[1] Registrando Admin...")
    register_user(**admins[0])
    
    # 2. Login Admin
    print("\n[2] Logando como Admin...")
    admin_login = login(admins[0]["email"], admins[0]["senha"])
    if not admin_login:
        print("Falha crítica: Não foi possível logar como admin. Abortando.")
        return

    admin_token = admin_login.get("token")
    if not admin_token:
        print("Falha crítica: Token não retornado.")
        return
        
    print("Admin logado com sucesso.")

    # 3. Adicionar Livros
    print("\n[3] Adicionando Livros...")
    book_ids = []
    for book in books:
        bid = add_book(admin_token, book)
        if bid:
            book_ids.append(bid)
            
    # 4. Registrar Usuários Comuns
    print("\n[4] Registrando Usuários...")
    registered_users_logins = []
    for u in users:
        if register_user(**u):
            # Tenta logar para pegar ID e Token
            login_data = login(u["email"], u["senha"])
            if login_data:
                registered_users_logins.append(login_data)

    # 5. Adicionar Avaliações
    print("\n[5] Adicionando Avaliações Aleatórias...")
    if not book_ids or not registered_users_logins:
        print("Sem livros ou usuários suficientes para avaliar.")
    else:
        for user_data in registered_users_logins:
            uid = user_data["user_id"] # Assumindo que o login retorna user_id
            utoken = user_data["token"]
            
            # Cada usuário avalia aleatoriamente alguns livros
            num_reviews = random.randint(1, len(book_ids))
            books_to_review = random.sample(book_ids, num_reviews)
            
            for bid in books_to_review:
                nota = random.randint(3, 5) # Notas boas
                comentario = random.choice(comments)
                rate_book(utoken, bid, uid, nota, comentario)

    print("\n=== PROCESSO CONCLUÍDO ===")

if __name__ == "__main__":
    main()
