import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, ShoppingBag, Map as MapIcon, Users, Sprout, Heart, User, Menu, X,
  ShoppingCart, LogIn, Package, LogOut, Store,
} from "lucide-react";
import Logo from "./Logo";
import { useApp } from "@/lib/AppContext";
import { useConta } from "@/lib/ContaContext";
import { getLevel } from "@/data/mockData";

const navItems = [
  { to: "/", label: "Início", icon: Home },
  { to: "/produtos", label: "Produtos", icon: ShoppingBag },
  { to: "/mapa", label: "Mapa", icon: MapIcon },
  { to: "/produtores", label: "Produtores", icon: Users },
  { to: "/impacto", label: "Meu Impacto", icon: Sprout },
];

export default function Navbar() {
  const location = useLocation();
  const { pontos, carrinho, isAuthenticated } = useApp();
  const { user, logout, isVendedor } = useConta();
  const [open, setOpen] = useState(false);
  const cartCount = carrinho.reduce((total, item) => total + item.qty, 0);
  const level = getLevel(pontos).atual;

  const itens = isVendedor
    ? [...navItems, { to: "/painel-vendedor", label: "Meu Painel", icon: Store }]
    : navItems;

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3"><Logo size={36} /></Link>

          <nav className="hidden md:flex items-center gap-1">
            {itens.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${active ? "bg-emerald-800 text-white shadow-sm" : "text-emerald-900/70 hover:bg-emerald-800/10"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <Link to="/favoritos" className="p-2 rounded-full hover:bg-emerald-800/10" aria-label="Favoritos">
                <Heart size={20} className="text-emerald-900" />
              </Link>
            )}
            <Link to="/carrinho" className="relative p-2 rounded-full hover:bg-emerald-800/10" aria-label="Carrinho">
              <ShoppingCart size={22} className="text-emerald-900" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                  <span className="text-base">{level.emoji}</span> {pontos.toLocaleString("pt-BR")} pts
                </div>
                {!isVendedor && (
                  <Link to="/pedidos" className="hidden sm:flex p-2 rounded-full hover:bg-emerald-800/10" aria-label="Meus pedidos" title="Meus pedidos">
                    <Package size={20} className="text-emerald-900" />
                  </Link>
                )}
                <Link to="/perfil" className="flex items-center gap-1.5 p-2 rounded-full hover:bg-emerald-800/10" aria-label="Meu perfil">
                  <User size={20} className="text-emerald-900" />
                </Link>
              </>
            ) : (
              <Link to="/acesso" className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-800 text-white text-sm font-semibold">
                <LogIn size={16} /> Entrar
              </Link>
            )}
            <button className="md:hidden p-2 rounded-full hover:bg-emerald-800/10" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/60 bg-background px-4 py-3 space-y-1">
            {itens.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${active ? "bg-emerald-800 text-white" : "text-emerald-900/80 hover:bg-emerald-800/10"}`}
                >
                  <item.icon size={18} /> {item.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                <Link to="/favoritos" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-900/80 hover:bg-emerald-800/10">
                  <Heart size={18} /> Favoritos
                </Link>
                <Link to="/perfil" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-900/80 hover:bg-emerald-800/10">
                  <User size={18} /> Perfil ({(user?.tipo || "").toString()})
                </Link>
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} /> Sair
                </button>
              </>
            ) : (
              <Link to="/acesso" onClick={() => setOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-800 bg-emerald-800/10">
                <LogIn size={18} /> Entrar / Criar conta
              </Link>
            )}
          </div>
        )}
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border/60 px-2 py-1.5 flex items-center justify-around">
        {[...navItems.slice(0, 4), { to: "/carrinho", label: "Carrinho", icon: ShoppingCart }].map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${active ? "text-emerald-800" : "text-emerald-900/50"}`}
            >
              <item.icon size={20} className={active ? "scale-110 transition-transform" : ""} />
              {item.label.split(" ")[0]}
              {item.to === "/carrinho" && cartCount > 0 && (
                <span className="absolute top-0.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}