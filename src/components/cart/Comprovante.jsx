import React from "react";
import { Printer } from "lucide-react";

const moeda = (v) => `R$ ${Number(v || 0).toFixed(2).replace(".", ",")}`;
const formatarData = (v) => {
  if (!v) return "Data não informada";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "Data não informada" : d.toLocaleString("pt-BR");
};

export default function Comprovante({ pedido }) {
  if (!pedido) return null;
  const itens = Array.isArray(pedido.items) ? pedido.items : [];
  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm text-emerald-950" aria-label="Comprovante demonstrativo">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
        <div>
          <p className="text-lg font-bold">RaizJusta — comprovante demonstrativo</p>
          <p className="text-xs text-slate-600">Pedido #{pedido.order_number || pedido.id}</p>
          <p className="text-xs text-slate-600">{formatarData(pedido.criadoEm)}</p>
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white print:hidden"><Printer size={16} /> Imprimir</button>
      </header>
      <div className="mt-3 space-y-2">
        {itens.map((item, index) => (
          <div key={`${item.productId || item.name}-${index}`} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 text-sm">
            <div><strong>{item.qty || 1} × {item.name || "Produto"}</strong><p className="text-xs text-slate-600">{item.producer || "Produtor demonstrativo"}</p></div>
            <span className="whitespace-nowrap">{moeda(Number(item.price || 0) * Number(item.qty || 1))}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-base font-bold"><span>Total</span><span>{moeda(pedido.total)}</span></div>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">SIMULAÇÃO: nenhuma compra real, cobrança ou envio a produtor foi realizado.</p>
    </section>
  );
}
