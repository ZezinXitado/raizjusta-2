import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Package, DollarSign, TrendingUp, Store, Info, ShoppingBag, MapPin, ArrowRight } from "lucide-react";
import { useConta } from "@/lib/ContaContext";
import {
  produtosDoVendedor,
  criarProdutoVendedor,
  atualizarProdutoVendedor,
  removerProdutoVendedor,
} from "@/lib/store/sellerProducts";
import { ProdutoForm, ProdutoLinha } from "@/components/vendedor/ProdutoForm";
import PedidosRecebidos from "@/components/vendedor/PedidosRecebidos";
import { pedidosDoVendedor } from "@/lib/store/orders";
import DadosConta from "@/components/perfil/DadosConta";
import { useToast } from "@/components/ui/use-toast";

export default function PainelVendedor() {
  const { user } = useConta();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState(() => produtosDoVendedor(user.id));
  const [editando, setEditando] = useState(null);
  const [pedidos, setPedidos] = useState(() => pedidosDoVendedor(user.id));

  const recarregar = () => setProdutos(produtosDoVendedor(user.id));
  const recarregarPedidos = () => setPedidos(pedidosDoVendedor(user.id));

  const salvar = (dados) => {
    try {
      if (editando === "novo") {
        criarProdutoVendedor(user.id, {
          ...dados,
          produtorNome: user.propriedade || user.nome,
          city: user.cidade,
          state: user.estado,
        });
        toast({ title: "Produto cadastrado", description: `${dados.name} já aparece no catálogo.` });
      } else {
        atualizarProdutoVendedor(user.id, editando.id, dados);
        toast({ title: "Produto atualizado" });
      }
      recarregar();
      setEditando(null);
    } catch (falha) {
      toast({ title: "Não foi possível salvar", description: falha.message, variant: "destructive" });
    }
  };

  const excluir = (produto) => {
    if (!window.confirm(`Excluir “${produto.name}” do catálogo?`)) return;
    try {
      removerProdutoVendedor(user.id, produto.id);
      recarregar();
      toast({ title: "Produto excluído" });
    } catch (falha) {
      toast({ title: "Não foi possível excluir", description: falha.message, variant: "destructive" });
    }
  };

  const alternarDisponibilidade = (produto) => {
    try {
      atualizarProdutoVendedor(user.id, produto.id, { disponivel: !produto.disponivel });
      recarregar();
    } catch (falha) {
      toast({ title: "Não foi possível atualizar", description: falha.message, variant: "destructive" });
    }
  };

  const disponiveis = produtos.filter((p) => p.disponivel).length;
  const precoMedio = produtos.length
    ? produtos.reduce((total, p) => total + p.price, 0) / produtos.length
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Store size={13} /> Painel do vendedor
            </span>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold">
              {user.propriedade || user.nome}
            </h1>
            <p className="text-emerald-100/80 text-sm flex items-center gap-1.5 mt-1">
              <MapPin size={14} /> {user.cidade || "Cidade não informada"}–{user.estado || "--"} · responsável {user.nome}
            </p>
          </div>
          <button
            onClick={() => setEditando("novo")}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm"
          >
            <Plus size={18} /> Cadastrar produto
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={Package} label="Produtos cadastrados" value={produtos.length} />
        <Card icon={ShoppingBag} label="Disponíveis no catálogo" value={disponiveis} />
        <Card icon={DollarSign} label="Preço médio" value={`R$ ${precoMedio.toFixed(2).replace(".", ",")}`} />
        <Card icon={TrendingUp} label="Pedidos recebidos" value={pedidos.length} />
      </div>

      {editando && (
        <div className="mt-6">
          <ProdutoForm
            produto={editando === "novo" ? null : editando}
            onSalvar={salvar}
            onCancelar={() => setEditando(null)}
          />
        </div>
      )}

      <section className="mt-6 rounded-3xl bg-card border border-border p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-emerald-950">Meus produtos</h2>
          <span className="text-xs text-muted-foreground">{produtos.length} cadastrado(s)</span>
        </div>

        {produtos.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-6 text-center">
            <p className="font-semibold text-emerald-900">Você ainda não cadastrou produtos</p>
            <p className="text-sm text-emerald-800/80 mt-1">
              Cadastre o primeiro produto da sua propriedade: ele aparece no catálogo público na hora.
            </p>
            <button
              onClick={() => setEditando("novo")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-800 text-white text-sm font-semibold"
            >
              <Plus size={16} /> Cadastrar produto
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {produtos.map((produto) => (
              <ProdutoLinha
                key={produto.id}
                produto={produto}
                onEditar={setEditando}
                onExcluir={excluir}
                onDisponibilidade={alternarDisponibilidade}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <DadosConta />

        <section className="rounded-3xl bg-card border border-border p-5 sm:p-6">
          <h2 className="font-bold text-emerald-950 flex items-center gap-2">
            <Package size={18} className="text-emerald-700" /> Pedidos
          </h2>
          <PedidosRecebidos vendedorId={user.id} pedidos={pedidos} onAtualizar={recarregarPedidos} />
          <Link
            to="/produtos"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline"
          >
            Ver como meus produtos aparecem <ArrowRight size={15} />
          </Link>
        </section>
      </div>

      <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
        <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900/90">
          Os produtos cadastrados aqui ficam salvos neste navegador (modo demonstração). Ao conectar o Firestore,
          os mesmos campos são gravados na coleção <strong>produtos</strong>, com regras que só permitem editar
          os próprios itens. Veja o <Link to="/guia-exportacao" className="underline font-semibold">guia de exportação</Link>.
        </p>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700">
        <Icon size={20} />
      </div>
      <div className="mt-3 text-xl font-extrabold text-emerald-950">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {hint && <div className="text-[10px] text-amber-700 mt-0.5">{hint}</div>}
    </div>
  );
}