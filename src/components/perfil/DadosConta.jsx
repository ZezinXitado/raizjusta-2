import React, { useState } from "react";
import { Loader2, Check, MapPin } from "lucide-react";
import { useConta } from "@/lib/ContaContext";
import { categories } from "@/data/mockData";
import { UFS } from "@/data/estados";
import { inputAuth } from "@/components/auth/CampoAuth";

const campo =
  "w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15";

export default function DadosConta() {
  const { user, atualizarPerfil } = useConta();
  const [form, setForm] = useState({
    nome: user?.nome || "",
    propriedade: user?.propriedade || "",
    cidade: user?.cidade || "",
    estado: user?.estado || "",
    tiposProdutos: user?.tiposProdutos || [],
  });
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");
  const vendedor = user?.tipo === "vendedor";

  const alterar = (campoNome) => (evento) =>
    setForm((atual) => ({ ...atual, [campoNome]: evento.target.value }));

  const alternarTipo = (chave) =>
    setForm((atual) => ({
      ...atual,
      tiposProdutos: atual.tiposProdutos.includes(chave)
        ? atual.tiposProdutos.filter((c) => c !== chave)
        : [...atual.tiposProdutos, chave],
    }));

  const salvar = async (evento) => {
    evento.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await atualizarPerfil(form);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch (falha) {
      setErro(falha.message || "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={salvar} className="rounded-3xl bg-card border border-border p-5 sm:p-6">
      <h2 className="font-bold text-emerald-950 flex items-center gap-2">
        <MapPin size={18} className="text-emerald-700" />
        {vendedor ? "Dados da propriedade" : "Meus dados"}
      </h2>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {vendedor ? "Responsável" : "Nome"}
          </span>
          <input value={form.nome} onChange={alterar("nome")} className={`${campo} mt-1`} required />
        </label>
        {vendedor && (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Propriedade</span>
            <input value={form.propriedade} onChange={alterar("propriedade")} className={`${campo} mt-1`} />
          </label>
        )}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cidade</span>
          <input value={form.cidade} onChange={alterar("cidade")} className={`${campo} mt-1`} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</span>
          <select value={form.estado} onChange={alterar("estado")} className={`${campo} mt-1`}>
            <option value="">--</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </label>
      </div>

      {vendedor && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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

      {erro && <p className="mt-3 text-xs text-red-600">{erro}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2"
        >
          {salvando ? <><Loader2 size={15} className="animate-spin" /> Salvando…</> : "Salvar alterações"}
        </button>
        {salvo && (
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <Check size={14} /> Dados atualizados
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        E-mail e senha são gerenciados pelo serviço de autenticação e não podem ser alterados aqui.
      </p>
    </form>
  );
}