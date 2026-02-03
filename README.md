# 📚 Guia de Execução

Este projeto utiliza **Docker** para facilitar a configuração e execução de todos os serviços (Banco de Dados, Backend e Frontend).

---

<h1>Como executar a aplicação:</h1>

### 1. Pré-requisitos
Certifique-se de possuir o **Docker** e o **Docker Compose** instalados em sua máquina.

### 2. Configuração das Variáveis de Ambiente (.env)
Antes de rodar a aplicação, você deve criar um arquivo chamado `.env` na raiz do projeto. 

> **Aviso Importante:** Para rodar localmente, o arquivo `.env` é obrigatório.

Preencha o seu `.env` com o seguinte modelo (veja também o arquivo env.example para mais detalhes):

```
DB_URL=jdbc:postgresql://postgres:5432/ProjIntegrador4
DB_NAME=ProjIntegrador4
DB_USER=postgres
DB_PASSWORD=sua_senha
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
RSA_PRIVATE_KEY=sua_chave_rsa
GOOGLE_BOOKS_API_KEY=sua_chave_google
FRONTEND_URL=http://localhost:3000
VITE_API_URL=
```

- Caso seja muito trabalhoso atribuir valores a todas às variáveis, fale com um dos colaboradores para te repassar um .env válido por um canal seguro

### 3. Execução para Desenvolvimento (Local)
Use este comando se você quiser rodar o projeto a partir do código-fonte na sua máquina (o Docker irá construir as imagens localmente):

1 - Abra o terminal na pasta raiz do projeto.

2 - Execute o seguinte comando:

```
docker compose up -d
```

> OBS: Caso você tenha volumes anteriores no seu Docker, talvez a aplicação não suba, rode antes o seguinte comando e depois o comando anterior

```
docker-compose down -v
```

### 4. Execução via Docker Hub (Produção)
Use este comando para rodar a aplicação baixando as imagens prontas do **Docker Hub**, sem precisar compilar o código:

1 - Certifique-se de que o arquivo `docker-compose.prod.yml` está na pasta.

2 - Execute o seguinte comando:

```
docker compose -f docker-compose.prod.yml up -d
```

> OBS: Caso você tenha volumes anteriores no seu Docker, talvez a aplicação não suba, rode antes o seguinte comando e depois o comando anterior

```
docker compose -f docker-compose.prod.yml down -v
```

---

### 5. Acessos Rápidos

- **Frontend:** [http://localhost:3000/](http://localhost:3000/)
- **Documentação da API (Swagger):** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
