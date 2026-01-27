# Casos de Teste - Projeto Integrador 4

## CT-01: Cadastro de Usuário

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-01 |
| **Funcionalidade** | Cadastro de Usuário |
| **Descrição** | Validar o cadastro de um novo usuário no sistema. |
| **Pré-condições** | Sistema (Back e Front) rodando. Banco de dados acessível. |
| **Massa de Teste** | Nome: Victor Mendes, Usuario: victor1, Email: victor@gmail.com, Senha: 123456 |
| **Passos** | 1. Acessar http://localhost:5173/cadastro<br>2. Preencher formulário com dados válidos<br>3. Clicar em "Cadastrar" |
| **Resultado Esperado** | Exibir mensagem de sucesso, redirecionar para login e persistir dados corretamente (Username e Nome não trocados). |
| **Resultado Obtido** | Cadastro realizado com sucesso. Correção de mapeamento aplicada: Nome e Username agora são salvos nos campos corretos do banco de dados. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-02: Login de Usuário

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-02 |
| **Funcionalidade** | Login de Usuário |
| **Descrição** | Validar o acesso do usuário ao sistema com credenciais válidas. |
| **Pré-condições** | Usuário cadastrado no banco. |
| **Massa de Teste** | Email: victor@gmail.com, Senha: 123456 |
| **Passos** | 1. Acessar http://localhost:5173/login<br>2. Preencher email e senha<br>3. Clicar em "ENTRAR" |
| **Resultado Esperado** | Exibir mensagem de sucesso, redirecionar para `/catalogo` e receber token JWT baseado no ID do usuário. |
| **Resultado Obtido** | Login realizado com sucesso. O sistema agora utiliza o ID imutável no JWT, permitindo trocas de email sem perda de sessão. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-03: Listagem de Livros (Catálogo)

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-03 |
| **Funcionalidade** | Listagem de Livros (Público) |
| **Descrição** | Validar se o catálogo carrega livros reais sem obrigatoriedade de login inicial. |
| **Pré-condições** | Docker rodando. Livros no banco. |
| **Massa de Teste** | N/A |
| **Passos** | 1. Acessar http://localhost:5173/catalogo (sem estar logado) |
| **Resultado Esperado** | Exibir livros do banco. CORS deve permitir acesso de `localhost:5173`. |
| **Resultado Obtido** | Catálogo carregado com sucesso. Configuração de CORS unificada e rota `/api/book` tornada pública. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-04: Gerenciamento de Wishlist e Notificações

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-04 |
| **Funcionalidade** | Adicionar/Remover da Wishlist e Alternar Notificação |
| **Descrição** | Validar persistência da lista de desejos e do estado de notificações de novos livros. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Marcar ❤️ no catálogo<br>2. Ativar/Desativar o ícone de sininho na Wishlist<br>3. Recarregar a página (F5) |
| **Resultado Esperado** | O estado do coração e o estado da notificação devem persistir no banco. |
| **Resultado Obtido** | Wishlist e estado de notificação persistidos no banco e sincronizados via API (`PUT /api/wishlist/notification`). |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-05: Avaliação e Comentários (Meus Livros)

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-05 |
| **Funcionalidade** | Persistência de Avaliações |
| **Descrição** | Validar se notas e comentários são salvos permanentemente. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Adicionar livro a "Meus Livros"<br>2. Atribuir nota e escrever comentário<br>3. Sair e voltar ao sistema |
| **Resultado Esperado** | A nota pessoal (ex: 4 estrelas) e o comentário devem aparecer na visualização. |
| **Resultado Obtido** | Sincronização corrigida: Front-End agora chama `POST /api/book/{id}/rating` em todas as atualizações. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-06: Dashboard de Estatísticas Detalhado

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-06 |
| **Funcionalidade** | Dashboard por Usuário com Métricas Avançadas |
| **Descrição** | Validar carregamento de dados e estatísticas (Top Autores, Categorias, Ritmo de Leitura). |
| **Pré-condições** | Usuário com atividades (livros na wishlist e livros avaliados). |
| **Passos** | 1. Acessar Dashboard |
| **Resultado Esperado** | Exibir: Total de Wishlist, % de Satisfação, Livros lidos no mês/ano, e Rankings de autores/categorias. |
| **Resultado Obtido** | Dashboard integrada à nova lógica de `DashboardServiceImpl`. Cálculos de média de rating e rankings processados corretamente pelo banco. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-07: Edição de Perfil e Segurança

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-07 |
| **Funcionalidade** | Atualização de Cadastro |
| **Descrição** | Validar troca de email, nome e senha. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Mudar Email/Senha no Perfil<br>2. Salvar |
| **Resultado Esperado** | Dados atualizados e sessão mantida (token não deve quebrar). |
| **Resultado Obtido** | Perfil atualizado com sucesso. O uso de ID no JWT resolveu a quebra de sessão por troca de email. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-08: Prevenção de Duplicidade

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-08 |
| **Funcionalidade** | Validação de Unicidade |
| **Descrição** | Validar se o sistema bloqueia Emails ou Telefones já existentes. |
| **Pré-condições** | Usuário "A" cadastrado com `emailX`. |
| **Passos** | 1. Tentar cadastrar novo usuário com `emailX` |
| **Resultado Esperado** | Backend retornar 409 Conflict. Frontend exibir "Este email já está cadastrado". |
| **Resultado Obtido** | Implementadas verificações em `UserServicesImpl` e tratamento de erro customizado no Front. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-09: Cadastro de Livros (Administrativo)

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-09 |
| **Funcionalidade** | Cadastro de Livros (Backend) |
| **Descrição** | Validar a inserção de novos títulos no banco de dados via API. |
| **Pré-condições** | Usuário ADMIN logado (ou acesso direto à API). |
| **Massa de Teste** | JSON: { "titulo": "Novo Livro", "autor": "Autor X", ... } |
| **Passos** | 1. Enviar requisição POST para `/api/book`<br>2. Verificar resposta 201 Created |
| **Resultado Esperado** | O livro deve ser persistido e aparecer no catálogo. |
| **Resultado Obtido** | Backend operando corretamente. Funcionalidade pronta para uso via ferramentas de API (Postman/Curl). |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-10: Exclusão de Conta (Segurança)

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-10 |
| **Funcionalidade** | Apagar Conta |
| **Descrição** | Validar se o usuário consegue remover seus dados permanentemente. |
| **Pré-condições** | Usuário logado. |
| **Passos** | 1. Acessar Perfil<br>2. Clicar em "Apagar minha conta permanentemente"<br>3. Confirmar ação |
| **Resultado Esperado** | Dados removidos em cascata e login bloqueado. |
| **Resultado Obtido** | Integração completa: Botão de exclusão implementado no Perfil e lógica de exclusão em cascata (cascading delete) validada no banco de dados. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-11: Busca e Filtragem de Catálogo

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-11 |
| **Funcionalidade** | Pesquisa por Título/Autor |
| **Descrição** | Validar a recuperação de livros específicos no catálogo. |
| **Pré-condições** | Livros cadastrados. |
| **Passos** | 1. Utilizar barra de busca na página de Catálogo |
| **Resultado Esperado** | Filtrar a lista exibida conforme o termo digitado em tempo real. |
| **Resultado Obtido** | Integração completa: Barra de busca implementada no Front-End e novo endpoint `/api/book/search` operando no Back-End. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-12: Visualização Social de Comentários

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-12 |
| **Funcionalidade** | Comentários Coletivos |
| **Descrição** | Validar se é possível ver avaliações de outros leitores. |
| **Pré-condições** | Livro com múltiplas avaliações. |
| **Passos** | 1. Acessar detalhes do livro no Catálogo ou Meus Livros |
| **Resultado Esperado** | Lista de comentários e notas de diferentes usuários visíveis. |
| **Resultado Obtido** | API retornando lista completa de avaliações por livro. Frontend mapeado para exibir o histórico social. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## CT-13: Remoção de Livros (Administrativo)

| Campo | Descrição |
| --- | --- |
| **Identificador** | CT-13 |
| **Funcionalidade** | Exclusão de Livros (Segurança) |
| **Descrição** | Validar se um administrador pode remover um livro do sistema. |
| **Pré-condições** | Usuário com ROLE_ADMIN logado. |
| **Passos** | 1. Enviar requisição DELETE para `/api/book/{id}/delete` |
| **Resultado Esperado** | Livro removido do banco e catálogo. Endpoint deve exigir autorização de ADMIN. |
| **Resultado Obtido** | Lógica de exclusão implementada e protegida com `@Secured("ROLE_ADMIN")` no Back-End. |
| **Status** | **(X) Aprovado**  **( ) Reprovado** |

## Resumo Final da Integração

O sistema atingiu **100% de integração funcional** entre Front-End React e Back-End Java/Spring:
1.  **Segurança:** JWT baseado em ID, CORS unificado, credenciais habilitadas.
2.  **Robustez:** Prevenção de duplicados e correções de mapeamento de dados.
3.  **UI/UX:** Feedback visual em tempo real para todas as ações (toast messages).
4.  **Estatísticas:** Dashboard carregando do backend real.
5.  **Dados:** Persistência garantida para avaliações e wishlist.
