// Seletores do catálogo: produtos demonstrativos + produtos cadastrados por vendedores.
import { products as demo, producers, categories } from "@/data/mockData";
import { lerProdutosVendedores } from "@/lib/store/sellerProducts";

export { categories };

export const CATALOGO_DEMO = demo;

export function listarProdutos() {
  return [...lerProdutosVendedores(), ...demo];
}

// Um produto está disponível quando não foi marcado como esgotado e tem estoque.
// Produtos antigos sem o campo `disponivel` contam como disponíveis.
export function estaDisponivel(produto) {
  if (!produto) return false;
  if (produto.disponivel === false) return false;
  return (produto.estoque ?? 1) > 0;
}

export function acharProduto(id) {
  return (
    demo.find((p) => p.id === id) || lerProdutosVendedores().find((p) => p.id === id) || null
  );
}

export function acharProdutor(id) {
  const cadastrado = producers.find((p) => p.id === id);
  if (cadastrado) return cadastrado;
  const produto = lerProdutosVendedores().find((p) => p.producerId === id);
  if (!produto) return null;
  return {
    id,
    name: produto.produtorNome || "Produtor(a) do RaizJusta",
    role: "Produtor(a) cadastrado",
    city: produto.city,
    state: produto.state,
    bio: "Produtor(a) com cadastro próprio no RaizJusta, vendendo direto para quem consome.",
    badges: ["Venda direta", "Comércio justo"],
    avatar: null,
    impact: { rendaPct: 70, produtosVendidos: 0, familias: 1 },
  };
}

export function produtorDoProduto(produto) {
  return produto ? acharProdutor(produto.producerId) : null;
}

export function produtosRelacionados(produto, limite = 4) {
  if (!produto) return [];
  return listarProdutos()
    .filter((p) => p.id !== produto.id && p.category === produto.category)
    .slice(0, limite);
}

export function estadosDisponiveis() {
  return [...new Set(listarProdutos().map((p) => p.state).filter(Boolean))].sort();
}