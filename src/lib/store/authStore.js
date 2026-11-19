// Contas locais de DEMONSTRAÇÃO, usadas quando o Firebase ainda não está configurado.
// Nenhuma senha é guardada: apenas um hash PBKDF2 (SHA-256, 120k iterações) com salt
// aleatório por conta. A sessão é um identificador local, nunca uma senha.
import { chave, ler, gravar, apagar, idAleatorio } from "./storage";

const CONTAS = chave("contas");
const SESSAO = chave("sessao");
const CONVIDADO = chave("convidado");

export const erro = (codigo, mensagem) => {
  const e = new Error(mensagem);
  e.codigo = codigo;
  return e;
};

export const hashDisponivel = () =>
  typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";

const paraBase64 = (bytes) => {
  let texto = "";
  bytes.forEach((b) => {
    texto += String.fromCharCode(b);
  });
  return btoa(texto);
};

const deBase64 = (texto) => Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));

async function derivar(senha, saltBase64) {
  const dados = new TextEncoder().encode(senha);
  const base = await crypto.subtle.importKey("raw", dados, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: deBase64(saltBase64), iterations: 120000, hash: "SHA-256" },
    base,
    256
  );
  return paraBase64(new Uint8Array(bits));
}

export function listarContas() {
  return ler(CONTAS, {});
}

function gravarContas(contas) {
  gravar(CONTAS, contas);
}

export function contaPublica(conta) {
  if (!conta) return null;
  const { hash, salt, ...publica } = conta;
  return publica;
}

export async function criarContaLocal(dados) {
  if (!hashDisponivel()) {
    throw erro("ambiente_inseguro", "Este navegador exige conexão segura (https) para criar a conta.");
  }
  const contas = listarContas();
  const email = String(dados.email).trim().toLowerCase();
  if (contas[email]) throw erro("email_em_uso", "Este e-mail já possui uma conta.");

  const salt = paraBase64(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await derivar(dados.senha, salt);
  const conta = {
    id: idAleatorio("u"),
    email,
    nome: dados.nome,
    tipo: dados.tipo,
    propriedade: dados.propriedade || "",
    cidade: dados.cidade || "",
    estado: dados.estado || "",
    tiposProdutos: dados.tiposProdutos || [],
    criadoEm: new Date().toISOString(),
    pontos: 0,
    compras: 0,
    produtoresApoiados: 0,
    produtosComprados: 0,
    produtoresVisitados: [],
    produtosScaneados: [],
    salt,
    hash,
  };
  gravarContas({ ...contas, [email]: conta });
  definirSessao(conta);
  return contaPublica(conta);
}

export async function entrarLocal(email, senha) {
  const contas = listarContas();
  const conta = contas[String(email).trim().toLowerCase()];
  if (!conta) throw erro("credenciais", "E-mail ou senha incorretos.");
  const hash = await derivar(senha, conta.salt);
  if (hash !== conta.hash) throw erro("credenciais", "E-mail ou senha incorretos.");
  definirSessao(conta);
  return contaPublica(conta);
}

export function definirSessao(conta) {
  gravar(SESSAO, { userId: conta.id, email: conta.email, token: idAleatorio("tk"), desde: Date.now() });
  apagar(CONVIDADO);
}

export function limparSessao() {
  apagar(SESSAO);
  apagar(CONVIDADO);
}

export function usuarioDaSessao() {
  const sessao = ler(SESSAO, null);
  if (!sessao) return null;
  const conta = listarContas()[sessao.email];
  if (!conta || conta.id !== sessao.userId) {
    apagar(SESSAO);
    return null;
  }
  return contaPublica(conta);
}

export function salvarConta(userId, patch) {
  const contas = listarContas();
  const entrada = Object.entries(contas).find(([, c]) => c.id === userId);
  if (!entrada) return null;
  const [email, conta] = entrada;
  const atualizada = {
    ...conta,
    ...patch,
    id: conta.id,
    email: conta.email,
    salt: conta.salt,
    hash: conta.hash,
  };
  gravarContas({ ...contas, [email]: atualizada });
  return contaPublica(atualizada);
}

export function definirConvidado() {
  apagar(SESSAO);
  gravar(CONVIDADO, { desde: Date.now() });
}

export function convidadoAtivo() {
  return Boolean(ler(CONVIDADO, null));
}