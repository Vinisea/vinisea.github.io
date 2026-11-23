import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.DATABASE_STORAGE = ":memory:";
process.env.DATABASE_URL = "";
process.env.JWT_SECRET = "test-secret-with-at-least-thirty-two-characters";
process.env.JWT_EXPIRES_IN = "1h";

const [{ default: app }, { conn }, { usuario }] = await Promise.all([
  import("../src/app.js"),
  import("../src/config/database.js"),
  import("../src/models/index.js"),
]);

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const pastaUploads = path.resolve(diretorioAtual, "../uploads");

let server;
let api;
let baseUrl;

before(async () => {
  await conn.authenticate();
  await conn.sync({ force: true });
  server = app.listen(0);
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  api = `${baseUrl}/api`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  await fs.rm(pastaUploads, { recursive: true, force: true });
  await fs.mkdir(pastaUploads);
  await fs.writeFile(path.join(pastaUploads, ".gitkeep"), "");
  await conn.close();
});

const requisicao = async (caminho, { token, ...opcoes } = {}) => {
  const headers = { ...opcoes.headers };

  if (opcoes.body && !(opcoes.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${api}${caminho}`, {
    ...opcoes,
    headers,
    body:
      opcoes.body instanceof FormData
        ? opcoes.body
        : opcoes.body
          ? JSON.stringify(opcoes.body)
          : undefined,
  });

  const dados = resposta.status === 204 ? null : await resposta.json();
  return { resposta, dados };
};

const criarImagem = (nome, tipo = "image/png") =>
  new Blob(
    [Buffer.from("89504e470d0a1a0a", "hex")],
    { type: tipo },
  );

test("cadastro único, login, JWT e CRUD de atividades com imagem", async () => {
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

  const semImagem = new FormData();
  semImagem.append("titulo", "Meu projeto");
  semImagem.append("descricao", "Descrição da atividade");
  semImagem.append("instituicao", "SENAI");
  semImagem.append("habilidades", "Backend");
  semImagem.append("dataEntrega", "2024-01-15");
  semImagem.append("id_categoria", String(categoriaCriada.dados.categoria.id_categoria));

  const atividadeSemImagem = await requisicao("/atividade/cadastrar", {
    method: "POST",
    token: login.dados.token,
    body: semImagem,
  });
  assert.equal(atividadeSemImagem.resposta.status, 400);

  const dadosPrimeiraImagem = new FormData();
  dadosPrimeiraImagem.append("titulo", "Meu projeto");
  dadosPrimeiraImagem.append("descricao", "Descrição da atividade");
  dadosPrimeiraImagem.append("tecnologias", "React e Node");
  dadosPrimeiraImagem.append("instituicao", "SENAI");
  dadosPrimeiraImagem.append("habilidades", "Backend");
  dadosPrimeiraImagem.append("dataEntrega", "2024-01-15");
  dadosPrimeiraImagem.append("id_categoria", String(categoriaCriada.dados.categoria.id_categoria));
  dadosPrimeiraImagem.append("imagem", criarImagem("projeto.png"), "projeto.png");

  const atividadeCriada = await requisicao("/atividade/cadastrar", {
    method: "POST",
    token: login.dados.token,
    body: dadosPrimeiraImagem,
  });
  assert.equal(atividadeCriada.resposta.status, 201);
  assert.equal(
    atividadeCriada.dados.atividade.id_usuario,
    cadastro.dados.usuario.id_usuario,
  );
  assert.match(
    atividadeCriada.dados.atividade.img_url,
    /^\/uploads\/.+\.png$/,
  );

  const primeiraImagemUrl = atividadeCriada.dados.atividade.img_url;
  const primeiraImagemResposta = await fetch(`${baseUrl}${primeiraImagemUrl}`);
  assert.equal(primeiraImagemResposta.status, 200);

  const atualizacaoSemImagem = new FormData();
  atualizacaoSemImagem.append("titulo", "Projeto atualizado");

  const atualizacao = await requisicao(
    `/atividade/atualizar/${atividadeCriada.dados.atividade.id_atividade}`,
    {
      method: "PUT",
      token: login.dados.token,
      body: atualizacaoSemImagem,
    },
  );
  assert.equal(atualizacao.resposta.status, 200);
  assert.equal(atualizacao.dados.atividade.titulo, "Projeto atualizado");
  assert.equal(atualizacao.dados.atividade.img_url, primeiraImagemUrl);

  const dadosNovaImagem = new FormData();
  dadosNovaImagem.append("imagem", criarImagem("projeto-novo.png"), "projeto-novo.png");

  const atualizacaoComImagem = await requisicao(
    `/atividade/atualizar/${atividadeCriada.dados.atividade.id_atividade}`,
    {
      method: "PUT",
      token: login.dados.token,
      body: dadosNovaImagem,
    },
  );
  assert.equal(atualizacaoComImagem.resposta.status, 200);
  assert.notEqual(atualizacaoComImagem.dados.atividade.img_url, primeiraImagemUrl);

  const primeiraImagemAntiga = path.join(
    pastaUploads,
    path.basename(primeiraImagemUrl),
  );
  await assert.rejects(fs.access(primeiraImagemAntiga));

  const atividadesPublicas = await requisicao("/atividade/listar");
  assert.equal(atividadesPublicas.resposta.status, 200);
  assert.equal(atividadesPublicas.dados.length, 1);

  const imagemAtualUrl = atualizacaoComImagem.dados.atividade.img_url;
  const exclusao = await requisicao(
    `/atividade/deletar/${atividadeCriada.dados.atividade.id_atividade}`,
    { method: "DELETE", token: login.dados.token },
  );
  assert.equal(exclusao.resposta.status, 204);
  await assert.rejects(
    fs.access(path.join(pastaUploads, path.basename(imagemAtualUrl))),
  );

  const tipoInvalido = new FormData();
  tipoInvalido.append("titulo", "Arquivo inválido");
  tipoInvalido.append("descricao", "Descrição da atividade");
  tipoInvalido.append("instituicao", "SENAI");
  tipoInvalido.append("habilidades", "Backend");
  tipoInvalido.append("dataEntrega", "2024-01-15");
  tipoInvalido.append("id_categoria", String(categoriaCriada.dados.categoria.id_categoria));
  tipoInvalido.append(
    "imagem",
    new Blob(["texto"], { type: "text/plain" }),
    "arquivo.txt",
  );

  const atividadeTipoInvalido = await requisicao("/atividade/cadastrar", {
    method: "POST",
    token: login.dados.token,
    body: tipoInvalido,
  });
  assert.equal(atividadeTipoInvalido.resposta.status, 400);
});
