import React from "react";
import { X } from "lucide-react";

export const FAIXAS_PRECO = [
  { key: "todas", label: "Qualquer preço" },
  { key: "ate10", label: "Até R$ 10", min: 0, max: 10 },
  { key: "10a20", label: "R$ 10 – 20", min: 10, max: 20 },
  { key: "20a40", label: "R$ 20 – 40", min: 20, max: 40 },
  { key: "acima40", label: "Acima de R$ 40", min: 40, max: Infinity },
];

export const ORDENACOES = [
  { key: "relevancia", label: "Relevância" },
  { key: "nome-az", label: "Nome (A–Z)" },
  { key: "nome-za", label: "Nome (Z–A)" },
  { key: "preco-asc", label: "Menor preço" },
  { key: "preco-desc", label: "Maior preço" },
];

function Pill({ ativo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        ativo
          ? "bg-emerald-800 border-emerald-800 text-white"
          : "bg-card border-border text-emerald-900/70 hover:bg-emerald-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function FiltrosCatalogo({
  estados,
  cidades,
  filtros,
  atualizar,
  limpar,
  ativos,
}) {
  return (
    <div className="rounded-3xl bg-card border border-border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-emerald-950 text-sm">Filtros</p>
        {ativos > 0 && (
          <button
            type="button"
            onClick={limpar}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
          >
            <X size={13} /> Limpar ({ativos})
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Preço</p>
        <div className="flex flex-wrap gap-2">
          {FAIXAS_PRECO.map((faixa) => (
            <Pill key={faixa.key} ativo={filtros.faixa === faixa.key} onClick={() => atualizar({ faixa: faixa.key })}>
              {faixa.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</span>
          <select
            value={filtros.estado}
            onChange={(e) => atualizar({ estado: e.target.value, cidade: "todas" })}
            className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="todos">Todos</option>
            {estados.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cidade</span>
          <select
            value={filtros.cidade}
            onChange={(e) => atualizar({ cidade: e.target.value })}
            className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="todas">Todas</option>
            {cidades.map((cidade) => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Disponibilidade</p>
        <div className="flex flex-wrap gap-2">
          <Pill ativo={filtros.disponibilidade === "todos"} onClick={() => atualizar({ disponibilidade: "todos" })}>
            Todos
          </Pill>
          <Pill
            ativo={filtros.disponibilidade === "disponiveis"}
            onClick={() => atualizar({ disponibilidade: "disponiveis" })}
          >
            Só disponíveis
          </Pill>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Ordenar por</p>
        <select
          value={filtros.ordenar}
          onChange={(e) => atualizar({ ordenar: e.target.value })}
          className="w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          {ORDENACOES.map((ordenacao) => (
            <option key={ordenacao.key} value={ordenacao.key}>{ordenacao.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}