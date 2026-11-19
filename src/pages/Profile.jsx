import React from "react";
import { Link } from "react-router-dom";
import { useConta } from "@/lib/ContaContext";
import { useApp } from "@/lib/AppContext";
import { getLevel } from "@/data/mockData";
import ImpactCounter from "@/components/ImpactCounter";
import MascotPanel from "@/components/MascotPanel";
import DadosConta from "@/components/perfil/DadosConta";
import { LogOut, Sparkles, Heart, Package, Store, Sprout, BarChart3, ShoppingBasket } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, logout, isVendedor } = useConta();
  const { pontos, compras, produtoresApoiados, produtosComprados, favoritos } = useApp();
  const { atual } = getLevel(pontos);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <ShoppingBasket size={26} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-emerald-950">Entre na sua conta</h1>
        <p className="mt-2 text-muted-foreground">Acesse para ver seu perfil, favoritos, pontos e pedidos.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/acesso" className="px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm">
            Entrar ou criar conta
          </Link>
          <Link to="/produtos" className="px-5 py-3 rounded-full bg-card border border-border font-semibold text-sm text-emerald-900">
            Continuar como visitante
          </Link>
        </div>
      </div>
    );
  }

  const nome = user.nome || user.full_name || user.email?.split("@")[0] || "Produtor(a)";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-3xl font-extrabold text-emerald-900 uppercase">
          {nome[0]}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-display text-2xl font-bold">{nome}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold capitalize">
              {user.tipo}
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">{user.email}</p>
          {isVendedor && user.propriedade && (
            <p className="text-emerald-100/70 text-xs mt-0.5">{user.propriedade} · {user.cidade}–{user.estado}</p>
          )}
          <p className="mt-1 text-sm text-emerald-100/70">
            🏅 {atual.nome} do Comércio Justo · <ImpactCounter value={pontos} /> pontos
          </p>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-sm font-medium"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>

      {!isVendedor && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Stat value={compras} label="Compras realizadas" />
          <Stat value={produtoresApoiados} label="Produtores apoiados" />
          <Stat value={favoritos.length} label="Favoritos salvos" />
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {isVendedor ? (
          <Link to="/painel-vendedor" className="rounded-2xl bg-amber-50 border border-amber-100 p-5 hover:bg-amber-100 transition-colors">
            <p className="font-bold text-amber-800 flex items-center gap-2"><Store size={16} /> Painel do vendedor</p>
            <p className="text-sm text-amber-700/80 mt-1">Cadastre produtos, preços e disponibilidade.</p>
          </Link>
        ) : (
          <>
            <Link to="/pedidos" className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 hover:bg-emerald-100 transition-colors">
              <p className="font-bold text-emerald-800 flex items-center gap-2"><Package size={16} /> Meus pedidos</p>
              <p className="text-sm text-emerald-700/80 mt-1">Acompanhe suas compras e o impacto gerado.</p>
            </Link>
            <Link to="/favoritos" className="rounded-2xl bg-red-50 border border-red-100 p-5 hover:bg-red-100 transition-colors">
              <p className="font-bold text-red-700 flex items-center gap-2"><Heart size={16} /> Meus favoritos</p>
              <p className="text-sm text-red-700/70 mt-1">{favoritos.length} produto(s) salvos.</p>
            </Link>
          </>
        )}
        <Link to="/impacto" className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 hover:bg-emerald-100 transition-colors">
          <p className="font-bold text-emerald-800 flex items-center gap-2"><Sprout size={16} /> Meu impacto</p>
          <p className="text-sm text-emerald-700/80 mt-1">Seus pontos, nível e progresso.</p>
        </Link>
        <Link to="/dashboard" className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 hover:bg-emerald-100 transition-colors">
          <p className="font-bold text-emerald-800 flex items-center gap-2"><BarChart3 size={16} /> Dashboard de impacto</p>
          <p className="text-sm text-emerald-700/80 mt-1">Impacto geral da plataforma.</p>
        </Link>
      </div>

      <div className="mt-6">
        <DadosConta />
      </div>

      <MascotPanel
        trigger={
          <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-white p-5 flex items-center gap-4 hover:from-amber-500 hover:to-amber-600 transition-colors text-left">
            <span className="text-3xl">🐾</span>
            <div className="flex-1">
              <p className="font-bold flex items-center gap-2"><Sparkles size={16} /> Interagir com o Raizinho</p>
              <p className="text-sm text-white/80">Converse com o mascote: dicas, seu impacto, conquistas e produtores.</p>
            </div>
            <span className="text-sm font-semibold">Abrir →</span>
          </button>
        }
      />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 text-center">
      <div className="text-3xl font-extrabold text-emerald-800"><ImpactCounter value={value} /></div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}