import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Info } from "lucide-react";
import { listarProdutos, estadosDisponiveis } from "@/lib/catalogo";
import { categories } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import FiltrosCatalogo, { FAIXAS_PRECO } from "@/components/catalog/FiltrosCatalogo";
import RaizinhoMascot from "@/components/RaizinhoMascot";

const INICIAIS = {
  faixa: "todas",
  estado: "todos",
  cidade: "todas",
  disponibilidade: "todos",
  ordenar: "relevancia",
};

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [categoria, setCategoria] = useState(params.get("categoria") || "todas");
  const [filtros, setFiltros] = useState(INICIAIS);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const produtos = listarProdutos();
  const estados = estadosDisponiveis();

  useEffect(() => {
    setQuery(params.get("q") || "");
    setCategoria(params.get("categoria") || "todas");
  }, [params]);

  const cidades = useMemo(() => {
    const base = produtos.filter((p) => filtros.estado === "todos" || p.state === filtros.estado);
    return [...new Set(base.map((p) => p.city).filter(Boolean))].sort();
  }, [produtos, filtros.estado]);

  const atualizar = (patch) => setFiltros((atual) => ({ ...atual, ...patch }));

  const ativos =
    (filtros.faixa !== "todas" ? 1 : 0) +
    (filtros.estado !== "todos" ? 1 : 0) +
    (filtros.cidade !== "todas" ? 1 : 0) +
    (filtros.disponibilidade !== "todos" ? 1 : 0);

  const filtrados = useMemo(() => {
    const faixa = FAIXAS_PRECO.find((f) => f.key === filtros.faixa) || FAIXAS_PRECO[0];
    const busca = query.trim().toLowerCase();

    const lista = produtos.filter((p) => {
      if (categoria !== "todas" && p.category !== categoria) return false;
      if (filtros.estado !== "todos" && p.state !== filtros.estado) return false;
      if (filtros.cidade !== "todas" && p.city !== filtros.cidade) return false;
      if (filtros.disponibilidade === "disponiveis" && !p.disponivel) return false;
      if (p.price < (faixa.min ?? 0) || p.price > (faixa.max ?? Infinity)) return false;
      if (busca) {
        const alvo = `${p.name} ${p.city} ${p.state} ${p.description || ""}`.toLowerCase();
        if (!alvo.includes(busca)) return false;
      }
      return true;
    });

    const ordenada = [...lista];
    if (filtros.ordenar === "nome-az") ordenada.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (filtros.ordenar === "nome-za") ordenada.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
    if (filtros.ordenar === "preco-asc") ordenada.sort((a, b) => a.price - b.price);
    if (filtros.ordenar === "preco-desc") ordenada.sort((a, b) => b.price - a.price);
    return ordenada;
  }, [produtos, categoria, filtros, query]);

  const trocarCategoria = (chave) => {
    setCategoria(chave);
    const proximos = new URLSearchParams(params);
    if (chave === "todas") proximos.delete("categoria");
    else proximos.set("categoria", chave);
    setParams(proximos, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-emerald-950">Catálogo da agricultura familiar</h1>
        <p className="text-muted-foreground mt-1">
          {produtos.length} produtos demonstrativos de produtores rurais de todo o país.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por produto, cidade ou estado…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button
          onClick={() => setMostrarFiltros((s) => !s)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-800 text-white text-sm font-semibold"
        >
          <SlidersHorizontal size={16} /> Filtros{ativos > 0 ? ` (${ativos})` : ""}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-4">
        <Chip ativo={categoria === "todas"} onClick={() => trocarCategoria("todas")}>Todas</Chip>
        {categories.map((c) => (
          <Chip key={c.key} ativo={categoria === c.key} onClick={() => trocarCategoria(c.key)}>
            {c.emoji} {c.label}
          </Chip>
        ))}
      </div>

      <div className={`mb-5 ${mostrarFiltros ? "" : "hidden"}`}>
        <FiltrosCatalogo
          estados={estados}
          cidades={cidades}
          filtros={filtros}
          atualizar={atualizar}
          limpar={() => setFiltros(INICIAIS)}
          ativos={ativos}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <p className="text-sm text-muted-foreground">{filtrados.length} produto(s) encontrado(s)</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info size={13} /> Catálogo demonstrativo — não são anúncios reais.
        </p>
      </div>

      {filtrados.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-center gap-4">
          <RaizinhoMascot size={150} art="thinking" contextMessage="Não encontrei nada... vamos tentar outra busca?" />
          <p className="text-muted-foreground max-w-sm">
            Hmm, não encontrei nada com esses filtros. Tente outra palavra, categoria ou limpe os filtros.
          </p>
          <button
            onClick={() => {
              setQuery("");
              trocarCategoria("todas");
              setFiltros(INICIAIS);
            }}
            className="px-4 py-2.5 rounded-full bg-emerald-800 text-white text-sm font-semibold"
          >
            Limpar busca e filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtrados.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ ativo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
        ativo
          ? "bg-emerald-800 text-white"
          : "bg-card border border-border text-emerald-900/70 hover:bg-emerald-800/10"
      }`}
    >
      {children}
    </button>
  );
}