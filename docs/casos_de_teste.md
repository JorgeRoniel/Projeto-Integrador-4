# Casos de Teste - Projeto Integrador 4

## CT-01: Cadastro de Usuário

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-01 |
| **Funcionalidade** | Cadastro de Usuário |
| **Descrição** | Validar o cadastro de um novo usuário no sistema. |
| **Pré-condições** | Sistema (Back e Front) rodando. Banco de dados acessível. |
| **Massa de Teste** | Nome: Victor, Sobrenome: Mendes, Email: victor@gmail.com, Senha: 123456, Usuario: victor |
| **Passos** | 1. Acessar http://localhost:5173/cadastro<br>2. Preencher formulário com dados válidos<br>3. Clicar em "Cadastrar" |
| **Resultado Esperado** | Exibir mensagem de sucesso, redirecionar para login e persistir dados na tabela `users_tb`. |
| **Resultado Obtido** | Mensagem de sucesso exibida e dados registrados com sucesso na tabela `users_tb` via API. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |



## CT-02: Login de Usuário

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-02 |
| **Funcionalidade** | Login de Usuário |
| **Descrição** | Validar o acesso do usuário ao sistema com credenciais válidas. |
| **Pré-condições** | Sistema rodando. Usuário deve estar cadastrado no banco (como o cadastro via Front falhou no CT-01, este teste **falhará** a menos que o usuário seja inserido manualmente via SQL). |
| **Massa de Teste** | Usuario: victor, Senha: 123456 |
| **Passos** | 1. Acessar http://localhost:5173/login<br>2. Preencher usuário e senha<br>3. Clicar em "ENTRAR" |
| **Resultado Esperado** | Exibir mensagem de sucesso, redirecionar para `/catalogo` e receber token JWT. |
| **Resultado Obtido** | Login realizado com sucesso, token JWT recebido e armazenado no LocalStorage, redirecionamento para o catálogo funcionando. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |
| **Observações** | Integração concluída com sucesso. O Front-End agora se comunica corretamente com o Back-End Java. |

## CT-03: Listagem de Livros (Catálogo)

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-03 |
| **Funcionalidade** | Listagem de Livros |
| **Descrição** | Validar se o catálogo carrega os livros reais vindos do banco de dados. |
| **Pré-condições** | Docker rodando (containers backend e db). Existência de livros no banco. |
| **Massa de Teste** | N/A |
| **Passos** | 1. Estar logado<br>2. Acessar http://localhost:3000/catalogo |
| **Resultado Esperado** | Exibir os livros cadastrados no banco em vez dos mocks. |
| **Resultado Obtido** | Livros carregados via API e exibidos dinamicamente nos componentes `BookCard`. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |


## Resumo dos Testes

O sistema iniciou o processo de integração entre Front-End e Back-End.
1.  **Autenticação (Login/Cadastro):** INTEGRADO.
2.  **Infraestrutura:** Docker Compose configurado.
3.  **Catálogo:** INTEGRADO. O Front-End agora busca a lista de livros reais dinamicamente.
4.  **Funcionalidades Adicionais (Wishlist/Meus Livros):** Próximo passo.
