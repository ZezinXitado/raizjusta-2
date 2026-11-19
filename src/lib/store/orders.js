// Pedidos locais (modo demonstração). Estrutura idêntica à que será gravada
// no Firestore quando o backend de pedidos for conectado.
import { chave, ler, gravar, idAleatorio } from "./storage";

const collection = (uid) => chave("pedidos", uid || "convidado");
const TODOS = chave("pedidos-todos");

export const STATUS = ["confirmado", "preparando", "enviado", "entregue"];

export function meusPedidos(uid) {
  return ler(collection(uid), []);
}

export function todosPedidos() {
  return ler(TODOS, []);
}

export function salvarPedido(uid, pedido) {
  const novo = {
    id: idAleatorio("ped"),
    criadoEm: new Date().toISOString(),
    demo: true,
    compradorId: uid,
    ...pedido,
  };
  gravar(collection(uid), [novo, ...meusPedidos(uid)]);
  // Índice global: permite que o vendedor veja os pedidos dos produtos dele.
  gravar(TODOS, [novo, ...todosPedidos()]);
  return novo;
}

export function itensDoVendedor(pedido, vendedorId) {
  return (pedido?.items || []).filter((item) => item.ownerId === vendedorId);
}

export function pedidosDoVendedor(vendedorId) {
  return todosPedidos().filter((pedido) => itensDoVendedor(pedido, vendedorId).length > 0);
}

export function atualizarStatus(compradorId, pedidoId, status) {
  const atualizar = (lista) => lista.map((p) => (p.id === pedidoId ? { ...p, status } : p));
  gravar(TODOS, atualizar(todosPedidos()));
  if (compradorId) gravar(collection(compradorId), atualizar(meusPedidos(compradorId)));
}