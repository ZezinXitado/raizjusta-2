import React from "react";
import { Link } from "react-router-dom";
import { itensDoVendedor, atualizarStatus, STATUS } from "@/lib/store/orders";

const ROTULOS = {
  confirmado: "Confirmado",
  preparando: "Preparando",
  enviado: "Enviado",
  entregue: "Entregue",
};

const CORES = {
  confirmado: "bg-amber-100 text-amber-800",
  preparando: "bg-sky-100 text-sky-800",
  enviado: "bg-indigo-100 text-indigo-800",
  entregue: "bg-emerald-100 text-emerald-800",
};

const dinheiro = (valor) => `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

const dataLegivel = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
};

export default function PedidosRecebidos({ vendedorId, pedidos, onAtualizar }) {
  const trocarStatus = (pedido, status) => {
    atualizarStatus(pedido.compradorId, pedido.id, status);
    onAtualizar();
  };

  if (!pedidos.length) {
    return (
      <div className="mt-4 rounded-2xl bg-muted/40 border border-dashed border-border p-6 text-center">
        <p className="font-semibold text-emerald-900">Nenhum pedido ainda</p>
        <p className="text-sm text-muted-foreground mt-1">
          Quando um comprador finalizar uma compra com produtos seus, o pedido aparece aqui.
        </p>
        <Link to="/produtos" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {pedidos.map((pedido) => {
        const itens = itensDoVendedor(pedido, vendedorId);
        const subtotal = itens.reduce((total, item) => total + item.price * item.qty, 0);
        return (
          <div key={pedido.id} className="rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-emerald-950 text-sm">Pedido #{pedido.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  {dataLegivel(pedido.criadoEm)} · {pedido.compradorNome || "Comprador"}
                </p>
              </div>
              <select
                value={pedido.status}
                onChange={(evento) => trocarStatus(pedido, evento.target.value)}
                aria-label="Status do pedido"
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border-0 outline-none ${
                  CORES[pedido.status] || CORES.confirmado
                }`}
              >
                {STATUS.map((status) => (
                  <option key={status} value={status}>
                    {ROTULOS[status]}
                  </option>
                ))}
              </select>
            </div>

            <ul className="mt-3 space-y-1.5">
              {itens.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-emerald-950 truncate">
                    {item.qty}× {item.name}
                  </span>
                  <span className="text-muted-foreground shrink-0">{dinheiro(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Seus itens neste pedido</span>
              <span className="font-bold text-emerald-800">{dinheiro(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Repasse estimado ao produtor (70%): {dinheiro(subtotal * 0.7)}
            </p>
          </div>
        );
      })}
    </div>
  );
}