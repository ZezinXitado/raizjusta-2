import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AvisoModoLocal from "@/components/auth/AvisoModoLocal";
import CampoAuth, { inputAuth } from "@/components/auth/CampoAuth";
import { useConta } from "@/lib/ContaContext";

export default function Entrar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { entrar } = useConta();
  const tipo = params.get("tipo") === "vendedor" ? "vendedor" : "comprador";
  const returnTo = params.get("returnTo") || "";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const destino = returnTo || (tipo === "vendedor" ? "/painel-vendedor" : "/");

  const enviar = async (evento) => {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await entrar({ email, senha, tipo });
      navigate(destino, { replace: true });
    } catch (falha) {
      setErro(falha.message || "Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthShell>
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-emerald-950">
          {tipo === "vendedor" ? "Entrar como vendedor" : "Entrar como comprador"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse com seu e-mail e senha. Não usamos login social neste protótipo.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-full bg-muted text-xs font-semibold">
          <Link
            to={`/entrar?tipo=comprador${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className={`py-2 rounded-full text-center transition-colors ${tipo === "comprador" ? "bg-card text-emerald-900 shadow-sm" : "text-muted-foreground"}`}
          >
            Sou comprador
          </Link>
          <Link
            to={`/entrar?tipo=vendedor${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className={`py-2 rounded-full text-center transition-colors ${tipo === "vendedor" ? "bg-card text-emerald-900 shadow-sm" : "text-muted-foreground"}`}
          >
            Sou vendedor
          </Link>
        </div>

        <div className="mt-5">
          <AvisoModoLocal />
        </div>

        {erro && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span>{erro}</span>
          </div>
        )}

        <form onSubmit={enviar} className="space-y-4">
          <CampoAuth label="E-mail">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className={inputAuth}
              required
            />
          </CampoAuth>
          <CampoAuth label="Senha">
            <input
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              className={inputAuth}
              required
            />
          </CampoAuth>

          <div className="flex justify-end">
            <Link to="/recuperar-senha" className="text-xs font-semibold text-emerald-700 hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
          >
            {enviando ? <><Loader2 size={18} className="animate-spin" /> Entrando…</> : <>Entrar <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link
            to={`/criar-conta?tipo=${tipo}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Criar conta de {tipo}
          </Link>
        </p>
        <p className="mt-2 text-center text-xs">
          <Link to="/acesso" className="text-emerald-700 hover:underline">
            Voltar para a escolha de perfil
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}