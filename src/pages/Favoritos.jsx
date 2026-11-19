import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { acharProduto } from "@/lib/catalogo";
import ProductCard from "@/components/ProductCard";
import RaizinhoMascot from "@/components/RaizinhoMascot";

export default function Favoritos() {
  const { favoritos, isAuthenticated } = useApp();
  const produtos = favoritos.map(acharProduto).filter(Boolean);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto">
          <RaizinhoMascot size={150} art="wave" contextMessage="Crie sua conta para guardar favoritos 💚" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-emerald-950">Seus favoritos ficam salvos na conta</h1>
        <p className="mt-2 text-muted-foreground">
          Crie uma conta gratuita de comprador para guardar os produtos que você quer comprar depois.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/criar-conta?tipo=comprador&returnTo=/favoritos"
            className="px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm"
          >
            Criar conta de comprador
          </Link>
          <Link
            to="/entrar?tipo=comprador&returnTo=/favoritos"
            className="px-5 py-3 rounded-full bg-card border border-border font-semibold text-sm text-emerald-900"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto">
          <RaizinhoMascot size={140} art="thinking" contextMessage="Nenhum favorito ainda..." />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-emerald-950">Você ainda não salvou favoritos</h1>
        <p className="mt-2 text-muted-foreground">
          Toque no coração dos produtos que você gostou para encontrá-los aqui depois.
        </p>
        <Link
          to="/produtos"
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm"
        >
          Explorar produtos <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-1">
        <Heart size={22} className="text-red-500 fill-red-500" />
        <h1 className="font-display text-3xl font-bold text-emerald-950">Meus favoritos</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        {produtos.length} produto(s) salvos para depois.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} product={produto} />
        ))}
      </div>
    </div>
  );
}