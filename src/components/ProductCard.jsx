import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, MapPin, BadgeCheck, ShoppingCart, Heart, PackageX } from "lucide-react";
import { produtorDoProduto } from "@/lib/catalogo";
import { useApp } from "@/lib/AppContext";
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";

const dinheiro = (valor) => `R$ ${valor.toFixed(2).replace(".", ",")}`;

export default function ProductCard({ product }) {
  const produtor = produtorDoProduto(product);
  const { addToCart, addPontos, toggleFavorito, ehFavorito } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const favorito = ehFavorito(product.id);

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.disponivel) return;
    addToCart(product.id);
    addPontos(product.sustainable ? 150 : 100);
    toast({
      title: `${product.name} adicionado ao carrinho`,
      description: `+${product.sustainable ? 150 : 100} pontos de impacto`,
    });
  };

  const handleFavorito = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const salvo = toggleFavorito(product.id);
    if (!salvo) {
      toast({
        title: "Crie sua conta para salvar favoritos",
        description: "É rápido e gratuito: assim seus favoritos ficam salvos.",
      });
      navigate("/acesso?returnTo=/produtos");
      return;
    }
    toast({ title: favorito ? "Removido dos favoritos" : "Salvo nos favoritos" });
  };

  return (
    <Link
      to={`/produtos/${product.id}`}
      className="group block rounded-3xl bg-card border border-border/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fittingType="fill"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-xs font-semibold backdrop-blur">
          <BadgeCheck size={13} /> Justo {product.fairTradePct}%
        </div>
        <button
          onClick={handleFavorito}
          aria-label={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Heart size={17} className={favorito ? "fill-red-500 text-red-500" : "text-emerald-800"} />
        </button>
        {!product.disponivel && (
          <div className="absolute inset-0 bg-emerald-950/55 flex flex-col items-center justify-center text-white text-center px-3">
            <PackageX size={26} />
            <span className="mt-1 text-xs font-bold uppercase tracking-wide">Indisponível</span>
          </div>
        )}
        {product.sustainable && product.disponivel && (
          <div className="absolute bottom-2.5 left-3 px-2 py-1 rounded-full bg-lime-500/90 text-white text-[11px] font-semibold">
            🌱 Sustentável
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base text-emerald-950 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-semibold text-emerald-900">{product.rating}</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1 truncate">
          <MapPin size={12} className="shrink-0" /> {produtor?.name} · {product.city}–{product.state}
        </p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-extrabold text-emerald-800">{dinheiro(product.price)}</span>
            <span className="text-xs text-muted-foreground"> / {product.unidade || "unidade"}</span>
          </div>
          <button
            onClick={handleBuy}
            disabled={!product.disponivel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-muted disabled:text-muted-foreground text-white text-xs font-semibold transition-colors active:scale-95"
          >
            <ShoppingCart size={14} /> {product.disponivel ? "Comprar" : "Esgotado"}
          </button>
        </div>
      </div>
    </Link>
  );
}