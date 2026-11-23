# Projeto de Portfólio

## O que é?
Esse projeto visa ajudar os professores na correção dos nossos portfólios, tornando mais dinâmica a visualização de atividades e projetos desenvolvidos ao longo do ano.

## Técnologias usadas
* React
* Node.JS

## Backend

O backend usa Express e Sequelize. SQLite é usado localmente; em produção, configure PostgreSQL com `DATABASE_URL`.

1. Entre na pasta `backend` e instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e defina um `JWT_SECRET` aleatório com pelo menos 32 caracteres.
3. Inicie o servidor com `npm run dev`. Por padrão, a API fica em `http://localhost:3333/api`.
4. Execute os testes com `npm test`.

### Autenticação

O primeiro cadastro cria a única conta do portfólio. Depois disso, novos cadastros retornam `409 Conflict`. O cadastro e o login retornam `{ message, token, usuario }`; o objeto `usuario` contém `id_usuario`, `nome` e `email`, nunca a senha.

Envie o token nas rotas protegidas pelo cabeçalho `Authorization: Bearer <token>`. O prazo padrão do token é um dia e pode ser alterado por `JWT_EXPIRES_IN`.

### Rotas da API

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/user/cadastrar` | Público, somente para criar a primeira conta |
| `POST` | `/user/login` | Público |
| `GET` | `/user/lista` | Usuário autenticado |
| `DELETE` | `/user/deletar/:id` | Usuário autenticado |
| `GET` | `/categoria/listar` | Público |
| `GET` | `/categoria/listar/:id` | Público |
| `POST` | `/categoria/cadastrar` | Usuário autenticado |
| `PUT` | `/categoria/atualizar/:id` | Usuário autenticado |
| `DELETE` | `/categoria/deletar/:id` | Usuário autenticado |
| `GET` | `/atividade/listar` | Público |
| `GET` | `/atividade/listar/:id` | Público |
| `POST` | `/atividade/cadastrar` | Usuário autenticado |
| `PUT` | `/atividade/atualizar/:id` | Usuário autenticado |
| `DELETE` | `/atividade/deletar/:id` | Usuário autenticado |

O cadastro de usuário recebe `{ nome, email, senha, verificarSenha }`; o login recebe `{ email, senha }`. A atividade recebe `titulo`, `descricao`, `tecnologias`, `instituicao` (`SESI` ou `SENAI`), `habilidades`, `dataEntrega` (`YYYY-MM-DD`), `img_url` e `id_categoria`. O `id_usuario` é definido pelo token e não deve ser enviado pelo frontend.

### Upload de imagens das atividades

O cadastro e a atualização de atividades recebem arquivos em `multipart/form-data`. O campo do arquivo deve se chamar `imagem`. São aceitos arquivos PNG, JPEG e WebP com tamanho máximo de 5 MB.

No cadastro, envie todos os campos textuais da atividade junto com o arquivo:

```text
POST /atividade/cadastrar
Authorization: Bearer <token>
Content-Type: multipart/form-data

imagem: arquivo.png
titulo: Meu projeto
descricao: Descrição da atividade
tecnologias: React e Node
instituicao: SENAI
habilidades: Backend
dataEntrega: YYYY-MM-DD
id_categoria: 1
```

O backend salva o arquivo em `backend/uploads` e retorna `img_url` como uma rota relativa, por exemplo `/uploads/<nome-gerado>.png`. Essa imagem fica disponível pela URL do backend em `/uploads/<nome-gerado>.png`.

Na atualização, o envio da imagem é opcional. Para trocar a imagem, envie o campo `imagem` novamente. Quando nenhum arquivo novo é enviado, a imagem atual é preservada. Ao substituir ou excluir uma atividade, o arquivo local antigo é removido.

As rotas de listagem retornam arrays JSON, inclusive `[]` quando ainda não há registros. As consultas por ID retornam o registro diretamente; criação e atualização retornam `{ message, atividade }` ou `{ message, categoria }`.
