// Produtos cadastrados pelos vendedores. Persistidos localmente agora e com a
// mesma estrutura de documento usada no Firestore (coleção "produtos").
import { chave, ler, gravar, idAleatorio } from "./storage";
import { erro } from "./authStore";
import { IMAGENS_CATEGORIA } from "@/data/catalogoCompleto";

const PRODUTOS = chave("produtos-vendedores");

const arredondar = (valor) => Math.round(valor * 100) / 100;

const calcularReparticao = (preco) => ({
  produtor: arredondar(preco * 0.7),
  logistica: arredondar(preco * 0.15),
  plataforma: arredondar(preco * 0.1),
  fundo: arredondar(preco * 0.05),
});

export function lerProdutosVendedores() {
  return ler(PRODUTOS, []);
}

export function produtosDoVendedor(ownerId) {
  return lerProdutosVendedores().filter((p) => p.ownerId === ownerId);
}

export function criarProdutoVendedor(ownerId, dados) {
  const produtos = lerProdutosVendedores();
  const preco = Number(dados.price) || 0;
  const categoria = dados.category || "artesanais";
  const produto = {
    id: idAleatorio("vend"),
    ownerId,
    demo: false,
    name: String(dados.name).trim(),
    emoji: dados.emoji || "🌱",
    category: categoria,
    image: dados.image || IMAGENS_CATEGORIA[categoria] || IMAGENS_CATEGORIA.artesanais,
    price: preco,
    unidade: dados.unidade || "unidade",
    description: dados.description || "",
    disponivel: dados.disponivel ?? true,
    producerId: `vendedor-${ownerId}`,
    produtorNome: dados.produtorNome || "",
    city: dados.city || "",
    state: dados.state || "",
    rating: 5,
    fairTradePct: 90,
    sustainable: dados.sustainable ?? true,
    badges: ["Venda direta", "Produtor cadastrado", "Comércio justo"],
    breakdown: calcularReparticao(preco),
    criadoEm: new Date().toISOString(),
  };
  gravar(PRODUTOS, [produto, ...produtos]);
  return produto;
}

export function atualizarProdutoVendedor(ownerId, id, patch) {
  const produtos = lerProdutosVendedores();
  const alvo = produtos.find((p) => p.id === id);
  if (!alvo) throw erro("nao_encontrado", "Produto não encontrado.");
  if (alvo.ownerId !== ownerId) {
    throw erro("sem_permissao", "Você só pode alterar produtos da sua própria propriedade.");
  }
  const preco = patch.price !== undefined ? Number(patch.price) : alvo.price;
  const atualizado = {
    ...alvo,
    ...patch,
    price: preco,
    breakdown: calcularReparticao(preco),
    atualizadoEm: new Date().toISOString(),
  };
  gravar(
    PRODUTOS,
    produtos.map((p) => (p.id === id ? atualizado : p))
  );
  return atualizado;
}

export function removerProdutoVendedor(ownerId, id) {
  const produtos = lerProdutosVendedores();
  const alvo = produtos.find((p) => p.id === id);
  if (!alvo) throw erro("nao_encontrado", "Produto não encontrado.");
  if (alvo.ownerId !== ownerId) {
    throw erro("sem_permissao", "Você só pode excluir produtos da sua própria propriedade.");
  }
  gravar(
    PRODUTOS,
    produtos.filter((p) => p.id !== id)
  );
}