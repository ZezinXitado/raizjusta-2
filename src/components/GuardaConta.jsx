import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader2, Sprout, ShieldAlert } from "lucide-react";
import { useConta } from "@/lib/ContaContext";

export default function GuardaConta({ tipo, children }) {
  const { isLoadingAuth, isAuthenticated, user } = useConta();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={26} />
      </div>
    );
  }

  if (!isAuthenticated) {
    const destino = encodeURIComponent(location.pathname);
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl bg-card border border-border p-7 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Sprout size={24} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-emerald-950">
            {tipo === "vendedor" ? "Entre na sua conta de vendedor" : "Entre na sua conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta área é restrita a contas de {tipo === "vendedor" ? "vendedor rural" : "comprador"}.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              to={`/entrar?tipo=${tipo || "comprador"}&returnTo=${destino}`}
              className="px-5 py-3 rounded-2xl bg-emerald-800 text-white text-sm font-semibold"
            >
              Entrar
            </Link>
            <Link
              to={`/criar-conta?tipo=${tipo || "comprador"}&returnTo=${destino}`}
              className="px-5 py-3 rounded-2xl bg-card border border-border text-sm font-semibold text-emerald-900"
            >
              Criar conta
            </Link>
            <Link to="/acesso" className="text-xs text-emerald-700 font-semibold mt-1">
              Escolher outro tipo de acesso
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (tipo && user?.tipo !== tipo) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl bg-card border border-border p-7 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldAlert size={24} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-emerald-950">Perfil de acesso incorreto</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Você está conectado com uma conta de <strong>{user?.tipo}</strong>. Esta área é exclusiva para{" "}
            {tipo === "vendedor" ? "vendedores rurais" : "compradores"}.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              to={user?.tipo === "vendedor" ? "/painel-vendedor" : "/perfil"}
              className="px-5 py-3 rounded-2xl bg-emerald-800 text-white text-sm font-semibold"
            >
              Ir para a área da minha conta
            </Link>
            <Link
              to="/acesso"
              className="px-5 py-3 rounded-2xl bg-card border border-border text-sm font-semibold text-emerald-900"
            >
              Entrar com outro perfil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}