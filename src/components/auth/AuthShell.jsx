import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function AuthShell({ children, wide = false, voltar = "/acesso", voltarLabel = "Voltar" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-amber-50/70 bg-grain">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Ir para a página inicial">
            <Logo size={38} />
          </Link>
          <Link to={voltar} className="text-sm font-semibold text-emerald-800 hover:underline">
            {voltarLabel}
          </Link>
        </div>
        <div className={`mt-8 ${wide ? "" : "max-w-md mx-auto"}`}>{children}</div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          RaizJusta · feira digital de comércio justo · dados demonstrativos
        </p>
      </div>
    </div>
  );
}