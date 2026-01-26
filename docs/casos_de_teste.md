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

## CT-04: Gerenciamento de Wishlist

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-04 |
| **Funcionalidade** | Adicionar/Remover da Wishlist |
| **Descrição** | Validar se o usuário consegue adicionar e remover livros da lista de desejos. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Clicar no botão ❤️ em um livro do Catálogo<br>2. Ir para a página "Lista de Desejos"<br>3. Verificar se o livro está lá<br>4. Remover o livro |
| **Resultado Esperado** | O livro deve ser persistido na lista e removido quando solicitado. |
| **Resultado Obtido** | Livro adicionado com sucesso e persistiu após recarregamento (F5). |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-05: Gerenciamento de Meus Livros

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-05 |
| **Funcionalidade** | Adicionar a Meus Livros |
| **Descrição** | Validar se o usuário consegue adicionar livros à sua coleção pessoal. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Clicar no botão 📖 em um livro<br>2. Ir para a página "Meus Livros"<br>3. Verificar se o livro está lá |
| **Resultado Esperado** | O livro deve ser adicionado à coleção do usuário. |
| **Resultado Obtido** | Livro adicionado à coleção e nota (inicial 0) registrada com sucesso. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |



## CT-06: Dashboard de Estatísticas

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-06 |
| **Funcionalidade** | Dashboard de Usuário |
| **Descrição** | Validar se as estatísticas de leitura e satisfação são carregadas corretamente. |
| **Pré-condições** | Usuário logado com livros avaliados e na wishlist. |
| **Passos** | 1. Acessar http://localhost:5173/dashboard |
| **Resultado Esperado** | Exibir contagem real de livros na wishlist, % de satisfação e gráficos de categorias. |
| **Resultado Obtido** | Dados carregados via `/api/dashboard` e exibidos nos cards e gráficos circulares. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-07: Edição de Perfil

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-07 |
| **Funcionalidade** | Gerenciamento de Perfil |
| **Descrição** | Validar a alteração de dados cadastrais do usuário. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Acessar http://localhost:5173/perfil<br>2. Alterar Nome/Telefone<br>3. Clicar em "Salvar Alterações" |
| **Resultado Esperado** | Dados persistidos no banco e refletidos imediatamente no sistema. |
| **Resultado Obtido** | Chamada `PUT /api/user/{id}/update` realizada com sucesso e contexto global atualizado. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## Resumo dos Testes

O sistema concluiu o processo de integração entre Front-End e Back-End.
1.  **Autenticação (Login/Cadastro):** INTEGRADO.
2.  **Infraestrutura:** Docker Compose configurado.
3.  **Catálogo:** INTEGRADO e POPULADO.
4.  **Funcionalidades Adicionais (Wishlist/Meus Livros):** INTEGRADO.
5.  **Dashboard e Perfil:** INTEGRADO.
