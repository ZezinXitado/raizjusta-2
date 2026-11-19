import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background bg-grain flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const colunas = [
  {
    titulo: "Feira",
    links: [
      { to: "/produtos", label: "Produtos" },
      { to: "/produtores", label: "Produtores" },
      { to: "/mapa", label: "Mapa do Brasil" },
    ],
  },
  {
    titulo: "Sua conta",
    links: [
      { to: "/acesso", label: "Entrar ou criar conta" },
      { to: "/criar-conta?tipo=vendedor", label: "Vender no RaizJusta" },
      { to: "/perfil", label: "Meu perfil" },
    ],
  },
  {
    titulo: "Projeto",
    links: [
      { to: "/educacao", label: "Comércio justo" },
      { to: "/impacto", label: "Meu impacto" },
      { to: "/guia-exportacao", label: "Guia de exportação" },
    ],
  },
];

function Footer() {
  return (
    <footer className="hidden md:block border-t border-border/60 bg-emerald-950 text-emerald-100/80 mt-10">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-lg font-bold text-white">
            RAIZ<span className="text-amber-400">JUSTA</span>
          </div>
          <p className="mt-2 text-emerald-200/60 text-xs text-balance">
            Do campo para você, com mais justiça e valorização.
          </p>
          <p className="mt-3 text-emerald-200/50 text-[11px]">
            Feira digital de comércio justo para a agricultura familiar.
          </p>
        </div>

        {colunas.map((coluna) => (
          <div key={coluna.titulo}>
            <p className="font-semibold text-white mb-2">{coluna.titulo}</p>
            <ul className="space-y-1.5">
              {coluna.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs text-emerald-200/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-emerald-200/50">
          <span>© {new Date().getFullYear()} RaizJusta · protótipo demonstrativo de projeto escolar.</span>
          <span>Todos os produtores, preços e números são fictícios. Nenhum produto é um anúncio real.</span>
        </div>
      </div>
    </footer>
  );
}