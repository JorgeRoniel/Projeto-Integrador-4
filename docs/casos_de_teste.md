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
| **Resultado Obtido** | Mensagem de sucesso exibida e redirecionamento ocorreu, porém **os dados NÃO foram salvos no banco de dados**. |
| **Status** | **( ) Aprovado**  **(X) Reprovado** |



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
| **Resultado Obtido** | O frontend permite o login e redireciona para o catálogo **mesmo se o usuário não existir no banco**. Isso ocorre porque **não há verificação com o backend**, apenas validação local de preenchimento dos campos. |
| **Status** | **( ) Aprovado**  **(X) Reprovado** (Falso Positivo) |
| **Observações** | O Frontend atualmente é um protótipo visual (mock). Não há integração real com a API (fetch/axios) nas páginas de Login e Cadastro. |

## Resumo dos Testes

O sistema possui Front-End e Back-End funcionais isoladamente, mas **não estão integrados**.
1.  **Backend:** API e Banco de Dados funcionam (testado via inserção manual/código).
2.  **Frontend:** Telas funcionam visualmente, mas não enviam dados para o Backend.
