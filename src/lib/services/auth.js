// Camada única de autenticação do RaizJusta.
// Usa Firebase Authentication quando as variáveis VITE_FIREBASE_* existem;
// caso contrário opera no modo local de demonstração (sem senhas em texto puro).
import * as local from "@/lib/store/authStore";
import {
  firebaseConfigurado,
  obterAuth,
  firebaseLerPerfil,
  firebaseGravarPerfil,
} from "./firebase";

export const modoAuth = firebaseConfigurado ? "firebase" : "local";
export const firebaseAtivo = firebaseConfigurado;

export const AVISO_MODO_LOCAL =
  "O Firebase ainda não está configurado: as contas criadas agora são de demonstração e ficam salvas apenas neste navegador.";

export const erro = local.erro;

const normalizar = (dados) =>
  dados ? { ...dados, full_name: dados.nome || dados.full_name || "" } : null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mensagemTipo(tipoConta) {
  return tipoConta === "vendedor"
    ? "Esta conta é de vendedor rural. Escolha a opção “Sou vendedor” para entrar."
    : "Esta conta é de comprador. Escolha a opção “Sou comprador” para entrar.";
}

function validarCadastro(dados) {
  if (!dados.nome || !String(dados.nome).trim()) {
    throw erro("nome_obrigatorio", "Informe o nome do responsável.");
  }
  if (!EMAIL.test(String(dados.email || "").trim())) {
    throw erro("email_invalido", "Informe um e-mail válido.");
  }
  if (String(dados.senha || "").length < 6) {
    throw erro("senha_curta", "A senha deve ter pelo menos 6 caracteres.");
  }
  if (!["comprador", "vendedor"].includes(dados.tipo)) {
    throw erro("tipo_invalido", "Escolha se a conta é de comprador ou de vendedor.");
  }
}

function traduzir(falha) {
  const mapa = {
    "auth/email-already-in-use": ["email_em_uso", "Este e-mail já está cadastrado."],
    "auth/invalid-email": ["email_invalido", "E-mail inválido."],
    "auth/weak-password": ["senha_curta", "A senha deve ter pelo menos 6 caracteres."],
    "auth/wrong-password": ["credenciais", "E-mail ou senha incorretos."],
    "auth/user-not-found": ["credenciais", "E-mail ou senha incorretos."],
    "auth/invalid-credential": ["credenciais", "E-mail ou senha incorretos."],
    "auth/invalid-login-credentials": ["credenciais", "E-mail ou senha incorretos."],
    "auth/too-many-requests": ["muitas_tentativas", "Muitas tentativas. Aguarde alguns minutos e tente novamente."],
    "auth/network-request-failed": ["rede", "Falha de conexão. Verifique sua internet."],
    "auth/operation-not-allowed": [
      "metodo_desativado",
      "Ative o provedor “E-mail/senha” no console do Firebase para usar este login.",
    ],
    "auth/unauthorized-domain": [
      "dominio",
      "Este domínio não está autorizado no Firebase. Adicione-o em Authentication > Settings > Authorized domains.",
    ],
  };
  const [codigo, mensagem] = mapa[falha?.code] || [
    "desconhecido",
    falha?.message || "Não foi possível concluir a operação.",
  ];
  return erro(codigo, mensagem);
}

async function perfilFirebase(usuario) {
  const dados = await firebaseLerPerfil(usuario.uid).catch(() => null);
  return normalizar({
    id: usuario.uid,
    email: usuario.email,
    nome: dados?.nome || usuario.displayName || "",
    tipo: dados?.tipo || "comprador",
    propriedade: dados?.propriedade || "",
    cidade: dados?.cidade || "",
    estado: dados?.estado || "",
    tiposProdutos: dados?.tiposProdutos || [],
    pontos: dados?.pontos ?? 0,
    compras: dados?.compras ?? 0,
    produtoresApoiados: dados?.produtoresApoiados ?? 0,
    produtosComprados: dados?.produtosComprados ?? 0,
    produtoresVisitados: dados?.produtoresVisitados ?? [],
    produtosScaneados: dados?.produtosScaneados ?? [],
  });
}

async function usuarioFirebase() {
  const { onAuthStateChanged } = await import("firebase/auth");
  const auth = await obterAuth();
  return new Promise((resolve) => {
    const cancelar = onAuthStateChanged(auth, (usuario) => {
      cancelar();
      resolve(usuario);
    });
  });
}

export async function sessaoAtual() {
  if (local.convidadoAtivo()) {
    return normalizar({ id: "convidado", nome: "Visitante", email: "", tipo: "convidado" });
  }
  if (firebaseConfigurado) {
    try {
      const usuario = await usuarioFirebase();
      return usuario ? await perfilFirebase(usuario) : null;
    } catch {
      return null;
    }
  }
  return normalizar(local.usuarioDaSessao());
}

export async function entrar({ email, senha, tipo }) {
  if (!email || !senha) throw erro("campos", "Preencha e-mail e senha.");
  if (firebaseConfigurado) {
    const { signInWithEmailAndPassword, signOut } = await import("firebase/auth");
    const auth = await obterAuth();
    let credencial;
    try {
      credencial = await signInWithEmailAndPassword(auth, String(email).trim(), senha);
    } catch (falha) {
      throw traduzir(falha);
    }
    const perfil = await perfilFirebase(credencial.user);
    if (tipo && perfil.tipo !== tipo) {
      await signOut(auth);
      throw erro("tipo_incorreto", mensagemTipo(perfil.tipo));
    }
    local.limparSessao();
    return perfil;
  }
  const conta = normalizar(await local.entrarLocal(email, senha));
  if (tipo && conta.tipo !== tipo) {
    local.limparSessao();
    throw erro("tipo_incorreto", mensagemTipo(conta.tipo));
  }
  return conta;
}

export async function criarConta(dados) {
  validarCadastro(dados);
  if (firebaseConfigurado) {
    const { createUserWithEmailAndPassword, updateProfile, signOut } = await import("firebase/auth");
    const auth = await obterAuth();
    let credencial;
    try {
      credencial = await createUserWithEmailAndPassword(auth, String(dados.email).trim(), dados.senha);
    } catch (falha) {
      throw traduzir(falha);
    }
    try {
      await updateProfile(credencial.user, { displayName: dados.nome });
      await firebaseGravarPerfil(credencial.user.uid, {
        nome: dados.nome,
        email: String(dados.email).trim().toLowerCase(),
        tipo: dados.tipo,
        propriedade: dados.propriedade || "",
        cidade: dados.cidade || "",
        estado: dados.estado || "",
        tiposProdutos: dados.tiposProdutos || [],
        criadoEm: new Date().toISOString(),
        pontos: 0,
      });
    } catch {
      await signOut(auth);
      throw erro(
        "perfil",
        "A conta foi criada, mas o perfil não pôde ser salvo. Verifique as regras de segurança do Firestore."
      );
    }
    local.limparSessao();
    return perfilFirebase(credencial.user);
  }
  return normalizar(await local.criarContaLocal(dados));
}

export async function recuperarSenha(email) {
  if (!EMAIL.test(String(email || "").trim())) {
    throw erro("email_invalido", "Informe um e-mail válido.");
  }
  if (firebaseConfigurado) {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    const auth = await obterAuth();
    try {
      await sendPasswordResetEmail(auth, String(email).trim());
    } catch (falha) {
      throw traduzir(falha);
    }
    return true;
  }
  throw erro(
    "sem_firebase",
    "A recuperação por e-mail precisa do Firebase configurado. No modo local as contas existem apenas neste navegador — crie uma nova conta se necessário."
  );
}

export async function atualizarPerfil(usuario, patch) {
  if (!usuario || usuario.tipo === "convidado") {
    throw erro("sessao", "Entre na sua conta para salvar alterações.");
  }
  if (firebaseConfigurado) {
    await firebaseGravarPerfil(usuario.id, patch);
    return normalizar({ ...usuario, ...patch });
  }
  return normalizar(local.salvarConta(usuario.id, patch));
}

export function continuarComoConvidadoLocal() {
  local.definirConvidado();
  return normalizar({ id: "convidado", nome: "Visitante", email: "", tipo: "convidado" });
}

export async function sair() {
  if (firebaseConfigurado) {
    const { signOut } = await import("firebase/auth");
    try {
      await signOut(await obterAuth());
    } catch {
      /* sessão já encerrada */
    }
  }
  local.limparSessao();
}