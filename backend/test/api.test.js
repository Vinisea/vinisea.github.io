import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";

process.env.DATABASE_STORAGE = ":memory:";
process.env.DATABASE_URL = "";
process.env.JWT_SECRET = "test-secret-with-at-least-thirty-two-characters";
process.env.JWT_EXPIRES_IN = "1h";

const [{ default: app }, { conn }, { usuario }] = await Promise.all([
  import("../src/app.js"),
  import("../src/config/database.js"),
  import("../src/models/index.js"),
]);

let server;
let api;

before(async () => {
  await conn.authenticate();
  await conn.sync({ force: true });
  server = app.listen(0);
  await once(server, "listening");
  api = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await conn.close();
});

const requisicao = async (caminho, { token, ...opcoes } = {}) => {
  const headers = { ...opcoes.headers };
  if (opcoes.body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${api}${caminho}`, {
    ...opcoes,
    headers,
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  });
  const dados = resposta.status === 204 ? null : await resposta.json();
  return { resposta, dados };
};

test("cadastro único, login, JWT e CRUD de atividades", async () => {
  const cadastro = await requisicao("/user/cadastrar", {
    method: "POST",
    body: {
      nome: "Vinicius",
      email: "vinicius@example.com",
      senha: "senha-segura",
      verificarSenha: "senha-segura",
    },
  });
  assert.equal(cadastro.resposta.status, 201);
  assert.ok(cadastro.dados.token);
  assert.equal("senha" in cadastro.dados.usuario, false);

  const usuarioSalvo = await usuario.scope("ComSenha").findByPk(
    cadastro.dados.usuario.id_usuario,
  );
  assert.notEqual(usuarioSalvo.senha, "senha-segura");

  const segundoCadastro = await requisicao("/user/cadastrar", {
    method: "POST",
    body: {
      nome: "Outro",
      email: "outro@example.com",
      senha: "outra-senha",
      verificarSenha: "outra-senha",
    },
  });
  assert.equal(segundoCadastro.resposta.status, 409);

  const login = await requisicao("/user/login", {
    method: "POST",
    body: { email: "VINICIUS@example.com", senha: "senha-segura" },
  });
  assert.equal(login.resposta.status, 200);
  assert.ok(login.dados.token);

  const senhaIncorreta = await requisicao("/user/login", {
    method: "POST",
    body: { email: "vinicius@example.com", senha: "senha-errada" },
  });
  assert.equal(senhaIncorreta.resposta.status, 401);

  const atividadeSemToken = await requisicao("/atividade/cadastrar", {
    method: "POST",
    body: {},
  });
  assert.equal(atividadeSemToken.resposta.status, 401);

  const categoriaCriada = await requisicao("/categoria/cadastrar", {
    method: "POST",
    token: login.dados.token,
    body: { nome: "Programação", descricao: "Projetos de código" },
  });
  assert.equal(categoriaCriada.resposta.status, 201);

  const atividadeCriada = await requisicao("/atividade/cadastrar", {
    method: "POST",
    token: login.dados.token,
    body: {
      titulo: "Meu projeto",
      descricao: "Descrição da atividade",
      tecnologias: "React e Node",
      instituicao: "SENAI",
      habilidades: "Backend",
      dataEntrega: "2024-01-15",
      img_url: "https://example.com/projeto.png",
      id_categoria: categoriaCriada.dados.categoria.id_categoria,
      id_usuario: 999,
    },
  });
  assert.equal(atividadeCriada.resposta.status, 201);
  assert.equal(
    atividadeCriada.dados.atividade.id_usuario,
    cadastro.dados.usuario.id_usuario,
  );

  const atividadesPublicas = await requisicao("/atividade/listar");
  assert.equal(atividadesPublicas.resposta.status, 200);
  assert.equal(atividadesPublicas.dados.length, 1);

  const atualizacao = await requisicao(
    `/atividade/atualizar/${atividadeCriada.dados.atividade.id_atividade}`,
    {
      method: "PUT",
      token: login.dados.token,
      body: { titulo: "Projeto atualizado" },
    },
  );
  assert.equal(atualizacao.resposta.status, 200);
  assert.equal(atualizacao.dados.atividade.titulo, "Projeto atualizado");

  const exclusao = await requisicao(
    `/atividade/deletar/${atividadeCriada.dados.atividade.id_atividade}`,
    { method: "DELETE", token: login.dados.token },
  );
  assert.equal(exclusao.resposta.status, 204);
});
