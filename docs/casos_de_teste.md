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
