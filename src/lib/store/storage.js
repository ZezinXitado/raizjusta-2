// Acesso seguro ao localStorage. Todo o estado do RaizJusta vive aqui,
// sem depender de banco de dados ou APIs da plataforma.
const NS = "raizjusta";

export const chave = (...partes) => [NS, ...partes].filter(Boolean).join(":");

export function ler(chaveCompleta, fallback = null) {
  try {
    const raw = localStorage.getItem(chaveCompleta);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function gravar(chaveCompleta, valor) {
  try {
    localStorage.setItem(chaveCompleta, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function apagar(chaveCompleta) {
  try {
    localStorage.removeItem(chaveCompleta);
  } catch {
    /* ignora ambientes sem storage */
  }
}

export function idAleatorio(prefixo = "id") {
  const aleatorio = Math.random().toString(36).slice(2, 8);
  return `${prefixo}-${Date.now().toString(36)}${aleatorio}`;
}