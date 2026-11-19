import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, MailCheck, AlertCircle } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import CampoAuth, { inputAuth } from "@/components/auth/CampoAuth";
import { useConta } from "@/lib/ContaContext";

export default function RecuperarSenha() {
  const { recuperarSenha } = useConta();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async (evento) => {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await recuperarSenha(email);
      setEnviado(true);
    } catch (falha) {
      setErro(falha.message || "Não foi possível enviar o e-mail de recuperação.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthShell>
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-emerald-950">Recuperar senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe o e-mail da sua conta e enviaremos as instruções para criar uma nova senha.
        </p>

        {enviado ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-sm text-emerald-900">
            <p className="flex items-center gap-2 font-semibold">
              <MailCheck size={18} /> Verifique seu e-mail
            </p>
            <p className="mt-2 text-emerald-900/80">
              Se existir uma conta com <strong>{email}</strong>, as instruções de redefinição chegarão em instantes.
              Confira também a caixa de spam.
            </p>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-5 space-y-4">
            {erro && (
              <div className="flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span>{erro}</span>
              </div>
            )}
            <CampoAuth label="E-mail da conta">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputAuth}
                placeholder="voce@email.com"
                required
              />
            </CampoAuth>
            <button
              type="submit"
              disabled={enviando}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-semibold text-sm"
            >
              {enviando ? <><Loader2 size={18} className="animate-spin" /> Enviando…</> : "Enviar instruções"}
            </button>
          </form>
        )}

        <Link to="/entrar" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline">
          <ArrowLeft size={15} /> Voltar para o login
        </Link>
      </div>
    </AuthShell>
  );
}