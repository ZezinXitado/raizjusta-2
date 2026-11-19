import React, { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Check, X, Upload } from "lucide-react";
import { categories } from "@/data/mockData";
import { UFS } from "@/data/estados";

const campo =
  "w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15";

const VAZIO = {
  name: "",
  category: "hortaliccas",
  price: "",
  unidade: "kg",
  description: "",
  image: "",
  disponivel: true,
};

export function ProdutoForm({ produto, onSalvar, onCancelar }) {
  const [form, setForm] = useState(() =>
    produto
      ? {
          name: produto.name || "",
          category: produto.category || "hortaliccas",
          price: produto.price ?? "",
          unidade: produto.unidade || "kg",
          description: produto.description || "",
          image: produto.image || "",
          disponivel: produto.disponivel ?? true,
        }
      : VAZIO
  );
  const [erro, setErro] = useState("");
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  const alterar = (chave) => (evento) =>
    setForm((atual) => ({ ...atual, [chave]: evento.target.value }));

  // A foto é reduzida no navegador e guardada junto com o produto.
  const escolherImagem = (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setErro("Escolha um arquivo de imagem (JPG ou PNG).");
      return;
    }
    setErro("");
    setCarregandoImagem(true);
    const leitor = new FileReader();
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onload = () => {
        const limite = 700;
        const escala = Math.min(1, limite / Math.max(imagem.width, imagem.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);
        canvas.getContext("2d").drawImage(imagem, 0, 0, canvas.width, canvas.height);
        setForm((atual) => ({ ...atual, image: canvas.toDataURL("image/jpeg", 0.72) }));
        setCarregandoImagem(false);
      };
      imagem.onerror = () => {
        setErro("Não foi possível ler essa imagem.");
        setCarregandoImagem(false);
      };
      imagem.src = leitor.result;
    };
    leitor.onerror = () => {
      setErro("Não foi possível ler esse arquivo.");
      setCarregandoImagem(false);
    };
    leitor.readAsDataURL(arquivo);
  };

  const enviar = (evento) => {
    evento.preventDefault();
    if (!form.name.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setErro("Informe um preço maior que zero.");
      return;
    }
    onSalvar({ ...form, price: Number(form.price) });
  };

  return (
    <form onSubmit={enviar} className="rounded-3xl bg-emerald-50/60 border border-emerald-100 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-emerald-950">{produto ? "Editar produto" : "Novo produto"}</h3>
        <button type="button" onClick={onCancelar} className="p-1.5 rounded-full hover:bg-white" aria-label="Fechar">
          <X size={18} className="text-emerald-800" />
        </button>
      </div>

      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}

      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nome do produto</span>
          <input value={form.name} onChange={alterar("name")} className={`${campo} mt-1`} placeholder="Ex.: Alface crespa" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoria</span>
          <select value={form.category} onChange={alterar("category")} className={`${campo} mt-1`}>
            {categories.map((categoria) => (
              <option key={categoria.key} value={categoria.key}>{categoria.label}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preço (R$)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={alterar("price")}
              className={`${campo} mt-1`}
              placeholder="0,00"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unidade</span>
            <select value={form.unidade} onChange={alterar("unidade")} className={`${campo} mt-1`}>
              {["kg", "500 g", "unidade", "dúzia", "maço", "litro", "pacote"].map((unidade) => (
                <option key={unidade} value={unidade}>{unidade}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição</span>
          <textarea
            value={form.description}
            onChange={alterar("description")}
            rows={2}
            className={`${campo} mt-1`}
            placeholder="Como o produto é cultivado ou produzido"
          />
        </label>
        <div className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Foto do produto (opcional)
          </span>
          <div className="mt-1 flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="Prévia do produto" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-muted-foreground text-center px-1">Sem foto</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-border text-xs font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-50">
                <Upload size={14} />
                {carregandoImagem ? "Carregando…" : "Escolher foto"}
                <input type="file" accept="image/*" onChange={escolherImagem} className="hidden" />
              </label>
              <input
                value={form.image}
                onChange={alterar("image")}
                className={`${campo} mt-2`}
                placeholder="ou cole um link https://…"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                A foto é reduzida e salva neste navegador. Sem foto, usamos a imagem da categoria.
              </span>
            </div>
          </div>
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-emerald-900">
        <input
          type="checkbox"
          checked={form.disponivel}
          onChange={(e) => setForm((atual) => ({ ...atual, disponivel: e.target.checked }))}
          className="w-4 h-4 accent-emerald-700"
        />
        Produto disponível para venda
      </label>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold flex items-center gap-1.5">
          <Check size={15} /> {produto ? "Salvar alterações" : "Cadastrar produto"}
        </button>
        <button type="button" onClick={onCancelar} className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-semibold text-emerald-900">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function ProdutoLinha({ produto, onEditar, onExcluir, onDisponibilidade }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-border p-3">
      <img src={produto.image} alt={produto.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-emerald-950 text-sm truncate">{produto.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          R$ {produto.price.toFixed(2).replace(".", ",")} / {produto.unidade} · {produto.city}–{produto.state}
        </p>
        <p className="text-xs text-muted-foreground">
          Você recebe R$ {produto.breakdown?.produtor?.toFixed(2).replace(".", ",")} por venda
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            produto.disponivel ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
          }`}
        >
          {produto.disponivel ? "Disponível" : "Indisponível"}
        </span>
        <button
          onClick={() => onDisponibilidade(produto)}
          className="p-2 rounded-full hover:bg-emerald-50"
          aria-label={produto.disponivel ? "Marcar como indisponível" : "Marcar como disponível"}
          title={produto.disponivel ? "Marcar como indisponível" : "Marcar como disponível"}
        >
          {produto.disponivel ? <EyeOff size={16} className="text-emerald-800" /> : <Eye size={16} className="text-emerald-800" />}
        </button>
        <button onClick={() => onEditar(produto)} className="p-2 rounded-full hover:bg-emerald-50" aria-label="Editar produto">
          <Pencil size={16} className="text-emerald-800" />
        </button>
        <button onClick={() => onExcluir(produto)} className="p-2 rounded-full hover:bg-red-50" aria-label="Excluir produto">
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}

export const estados = UFS;
export const iconeNovo = Plus;