import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { producers, regions } from "@/data/mockData";
import { listarProdutos } from "@/lib/catalogo";
import { coordenadaDoProdutor } from "@/data/coordenadasProdutores";
import MapaProdutores from "@/components/mapa/MapaProdutores";
import ImpactCounter from "@/components/ImpactCounter";
import RaizinhoMascot from "@/components/RaizinhoMascot";

const dinheiro = (valor) => `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

const produtoresNoMapa = producers.filter((produtor) => coordenadaDoProdutor(produtor));
const ESTADOS = [...new Set(produtoresNoMapa.map((produtor) => produtor.state))].sort();

export default function MapPage() {
  const [estado, setEstado] = useState("todos");
  const [selecionado, setSelecionado] = useState(produtoresNoMapa[0]?.id || null);
  const produtos = useMemo(() => listarProdutos(), []);

  const produtosDoProdutor = (produtorId) => produtos.filter((p) => p.producerId === produtorId);

  const visiveis = estado === "todos" ? produtoresNoMapa : produtoresNoMapa.filter((p) => p.state === estado);
  const produtor = produtoresNoMapa.find((p) => p.id === selecionado) || visiveis[0] || null;
  const produtosSelecionados = produtor ? produtosDoProdutor(produtor.id) : [];

  const trocarEstado = (valor) => {
    setEstado(valor);
    const primeiro = valor === "todos" ? produtoresNoMapa[0] : produtoresNoMapa.find((p) => p.state === valor);
    setSelecionado(primeiro?.id || null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <RaizinhoMascot size={120} art="explorer" contextMessage="Bora explorar o mapa! 🗺️" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-950">🌎 Mapa do Comércio Justo</h1>
          <p className="text-muted-foreground mt-1">
            Produtores e cooperativas pelo Brasil. Localizações aproximadas por cidade, apenas para demonstração.
          </p>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-border bg-emerald-50/40 h-[380px] sm:h-[520px]">
          <MapaProdutores
            produtores={visiveis}
            produtosDoProdutor={produtosDoProdutor}
            selecionado={selecionado}
            onSelecionar={setSelecionado}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filtrar por estado</span>
              <select
                value={estado}
                onChange={(evento) => trocarEstado(evento.target.value)}
                className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-emerald-600"
              >
                <option value="todos">Todos os estados</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              {visiveis.length} produtor(es) no mapa · dados fictícios
            </p>
          </div>

          <div className="space-y-2">
            {visiveis.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelecionado(p.id)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${
                  produtor?.id === p.id
                    ? "bg-emerald-800 text-white border-emerald-800"
                    : "bg-card border-border hover:bg-emerald-800/10"
                }`}
              >
                <span className="truncate">📍 {p.name}</span>
                <span className="text-xs opacity-70 shrink-0">{p.city}–{p.state}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {produtor && (
        <section className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70">Produtor em destaque</p>
              <h2 className="font-display text-2xl font-bold">{produtor.name}</h2>
              <p className="text-sm text-emerald-100/80 flex items-center gap-1.5">
                <MapPin size={14} /> {produtor.city}–{produtor.state} · {produtor.role}
              </p>
            </div>
            <Link
              to={`/produtores/${produtor.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-emerald-900 text-sm font-semibold"
            >
              Ver perfil do produtor <ArrowRight size={15} />
            </Link>
          </div>

          <p className="mt-3 max-w-3xl text-sm text-emerald-50/85">{produtor.bio}</p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Mini valor={produtor.impact?.rendaPct} label="% da renda ao produtor" sufixo="%" />
            <Mini valor={produtor.impact?.produtosVendidos} label="produtos vendidos" />
            <Mini valor={produtor.impact?.familias} label="famílias envolvidas" />
            <Mini valor={produtosSelecionados.length} label="produtos no catálogo" />
          </div>

          {produtosSelecionados.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70 mb-2">
                Produtos deste produtor
              </p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {produtosSelecionados.slice(0, 6).map((produto) => (
                  <li key={produto.id}>
                    <Link
                      to={`/produtos/${produto.id}`}
                      className="flex items-center justify-between gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-sm transition-colors"
                    >
                      <span className="truncate">{produto.emoji} {produto.name}</span>
                      <span className="font-semibold shrink-0">{dinheiro(produto.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-emerald-950">Impacto por região</h2>
        <p className="text-sm text-muted-foreground">Números fictícios usados para demonstrar o conceito do projeto.</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((regiao) => (
            <div key={regiao.state} className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-emerald-950">{regiao.name}</p>
                <span className="text-xs text-muted-foreground">{regiao.state}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">👨‍🌾 <ImpactCounter value={regiao.produtores} /> produtores</span>
                <span className="text-muted-foreground">🌱 <ImpactCounter value={regiao.produtos} /> produtos</span>
                <span className="text-muted-foreground">💰 <ImpactCounter value={regiao.movimentado} prefix="R$ " /></span>
                <span className="text-muted-foreground">🤝 <ImpactCounter value={regiao.cooperativas} /> coop.</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Mini({ valor, label, sufixo = "" }) {
  return (
    <div className="rounded-2xl bg-white/10 py-3">
      <div className="text-xl font-extrabold">
        {valor ?? 0}
        {sufixo}
      </div>
      <div className="text-[11px] text-emerald-100/70">{label}</div>
    </div>
  );
}