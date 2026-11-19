import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBasket, Map } from "lucide-react";
import RaizinhoMascot from "@/components/RaizinhoMascot";

export default function NaoEncontrado() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="mx-auto">
        <RaizinhoMascot size={160} art="thinking" contextMessage="Essa página não existe... 🌱" />
      </div>
      <p className="mt-6 text-6xl font-display font-extrabold text-emerald-900/20">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-emerald-950">Página não encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        O endereço que você abriu não existe no RaizJusta. Que tal voltar para a feira?
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm">
          <ArrowLeft size={16} /> Página inicial
        </Link>
        <Link to="/produtos" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-card border border-border font-semibold text-sm text-emerald-900">
          <ShoppingBasket size={16} /> Ver produtos
        </Link>
        <Link to="/mapa" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-card border border-border font-semibold text-sm text-emerald-900">
          <Map size={16} /> Mapa
        </Link>
      </div>
    </div>
  );
}