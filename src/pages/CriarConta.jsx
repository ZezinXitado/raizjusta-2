import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ArrowRight, AlertCircle, Tractor, ShoppingBasket } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AvisoModoLocal from "@/components/auth/AvisoModoLocal";
import CampoAuth, { inputAuth } from "@/components/auth/CampoAuth";
import { useConta } from "@/lib/ContaContext";
import { categories } from "@/data/mockData";
import { UFS } from "@/data/estados";

const INICIAL = {
  nome: "",
  propriedade: "",
  email: "",
  senha: "",
  confirmar: "",
  cidade: "",
  estado: "",
  tiposProdutos: [],
};

export default function CriarConta() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { criarConta } = useConta();
  const tipo = params.get("tipo") === "comprador" ? "comprador" : "vendedor";
  const returnTo = params.get("returnTo") || "";

  const [form, setForm] = useState(INICIAL);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (evento) => setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  const alternarTipo = (chave) =>
    setForm((atual) => ({
      ...atual,
      tiposProdutos: atual.tiposProdutos.includes(chave)
        ? atual.tiposProdutos.filter((c) => c !== chave)
        : [...atual.tiposProdutos, chave],
    }));

  const enviar = async (evento) => {
    evento.preventDefault();
    setErro("");
    if (form.senha !== form.confirmar) {
      setErro("As senhas não conferem.");
      return;
    }
    if (tipo === "vendedor" && !form.propriedade.trim()) {
      setErro("Informe o nome da propriedade ou empreendimento.");
      return;
    }
    setEnviando(true);
    try {
      await criarConta({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo,
        propriedade: form.propriedade,
        cidade: form.cidade,
        estado: form.estado,
        tiposProdutos: form.tiposProdutos,
      });
      const destino = returnTo || (tipo === "vendedor" ? "/painel-vendedor" : "/");
      navigate(destino, { replace: true });
    } catch (falha) {
      setErro(falha.message || "Não foi possível criar a conta.");
    } finally {
      setEnviando(false);
    }
  };

  const Icone = tipo === "vendedor" ? Tractor : ShoppingBasket;

  return (
    <AuthShell>
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tipo === "vendedor" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
            <Icone size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-emerald-950">
              {tipo === "vendedor" ? "Conta de vendedor rural" : "Conta de comprador"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {tipo === "vendedor" ? "Cadastre sua propriedade e comece a vender" : "Compre direto de quem produz"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-full bg-muted text-xs font-semibold">
          <Link
            to={`/criar-conta?tipo=comprador${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className={`py-2 rounded-full text-center transition-colors ${tipo === "comprador" ? "bg-card text-emerald-900 shadow-sm" : "text-muted-foreground"}`}
          >
            Sou comprador
          </Link>
          <Link
            to={`/criar-conta?tipo=vendedor${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
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
          <CampoAuth label={tipo === "vendedor" ? "Nome do responsável" : "Seu nome"}>
            <input value={form.nome} onChange={alterar("nome")} className={inputAuth} placeholder="Nome completo" required />
          </CampoAuth>

          {tipo === "vendedor" && (
            <CampoAuth label="Nome da propriedade ou empreendimento">
              <input
                value={form.propriedade}
                onChange={alterar("propriedade")}
                className={inputAuth}
                placeholder="Sítio Boa Esperança"
                required
              />
            </CampoAuth>
          )}

          <CampoAuth label="E-mail">
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={alterar("email")}
              className={inputAuth}
              placeholder="voce@email.com"
              required
            />
          </CampoAuth>

          <div className="grid grid-cols-2 gap-3">
            <CampoAuth label="Senha">
              <input
                type="password"
                autoComplete="new-password"
                value={form.senha}
                onChange={alterar("senha")}
                className={inputAuth}
                placeholder="mínimo 6 caracteres"
                required
              />
            </CampoAuth>
            <CampoAuth label="Confirmar senha">
              <input
                type="password"
                autoComplete="new-password"
                value={form.confirmar}
                onChange={alterar("confirmar")}
                className={inputAuth}
                placeholder="repita a senha"
                required
              />
            </CampoAuth>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <CampoAuth label="Cidade">
              <input value={form.cidade} onChange={alterar("cidade")} className={inputAuth} placeholder="Sua cidade" required />
            </CampoAuth>
            <CampoAuth label="UF">
              <select value={form.estado} onChange={alterar("estado")} className={`${inputAuth} pr-8`} required>
                <option value="">--</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </CampoAuth>
          </div>

          {tipo === "vendedor" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900/60">
                Tipos de produtos comercializados
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((categoria) => {
                  const ativo = form.tiposProdutos.includes(categoria.key);
                  return (
                    <button
                      key={categoria.key}
                      type="button"
                      onClick={() => alternarTipo(categoria.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        ativo
                          ? "bg-emerald-800 border-emerald-800 text-white"
                          : "bg-card border-border text-emerald-900/70 hover:bg-emerald-50"
                      }`}
                    >
                      {categoria.emoji} {categoria.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
          >
            {enviando ? <><Loader2 size={18} className="animate-spin" /> Criando conta…</> : <>Criar conta <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            to={`/entrar?tipo=${tipo}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}