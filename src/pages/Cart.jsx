import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, Leaf, Users, Coins, MapPin, Handshake, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/AppContext";
import { acharProduto, acharProdutor } from "@/lib/catalogo";
import { salvarPedido } from "@/lib/store/orders";
import { useToast } from "@/components/ui/use-toast";
import Comprovante from "@/components/cart/Comprovante";
import RaizinhoMascot from "@/components/RaizinhoMascot";

const dinheiro = (valor) => `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;

export default function Cart() {
  const { carrinho, setQty, removeFromCart, clearCart, recordPurchase, isAuthenticated, user } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState("cart");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  const items = carrinho.map((i) => ({ ...i, product: acharProduto(i.id) })).filter((i) => i.product);
  const total = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const pontosGanhos = items.reduce((a, i) => a + (i.product.sustainable ? 150 : 100) * i.qty, 0);

  const producersSupported = new Set(items.map((i) => i.product.producerId)).size;
  const amountToProducers = items.reduce((a, i) => a + i.product.breakdown.produtor * i.qty, 0);
  const sustainablePractices = items.filter((i) => i.product.sustainable).length;
  const cooperativas = Math.max(1, Math.round(producersSupported / 2));
  const distance = Math.max(120, producersSupported * 180);
  const itemCount = items.reduce((a, i) => a + i.qty, 0);

  const handleConfirm = () => {
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const order_number = "RJ" + Math.floor(100000 + Math.random() * 900000);
      const criado = salvarPedido(
        user?.id || "convidado",
        {
          order_number,
          total,
          status: "confirmado",
          compradorNome: user?.nome || user?.full_name || "Visitante (convidado)",
          pontosGanhos,
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            qty: i.qty,
            image: i.product.image,
            producer: acharProdutor(i.product.producerId)?.name || "Produtor demonstrativo",
            producerId: i.product.producerId,
            ownerId: i.product.ownerId || null,
            sustainable: i.product.sustainable,
          })),
          impact: { producersSupported, amountToProducers, sustainablePractices, cooperativas, distance },
        },
        { indexar: Boolean(user?.id) }
      );
      recordPurchase({ itemCount, producersCount: producersSupported, pontosGanhos });
      clearCart();
      setOrder(criado);
      setStep("done");
    } catch (e) {
      toast({ title: "Erro ao finalizar pedido", description: e.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  const esvaziar = () => {
    if (!window.confirm("Esvaziar o carrinho demonstrativo?")) return;
    clearCart();
    toast({ title: "Carrinho esvaziado" });
  };

  // DONE
  if (step === "done" && order) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }} className="mx-auto">
            <RaizinhoMascot size={170} art="celebrate" trigger={{ name: "purchase", key: order.order_number }} contextMessage="Pedido demonstrativo confirmado! 💚" />
          </motion.div>
          <h1 className="mt-5 font-display text-2xl font-bold text-emerald-950">Pedido demonstrativo realizado com sucesso!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta é uma simulação do funcionamento do RaizJusta. Nenhuma compra real ou pagamento foi efetuado.
          </p>
          <p className="mt-2 text-sm text-emerald-900">
            Número do pedido: <span className="font-bold text-emerald-700">#{order.order_number}</span>
          </p>
        </motion.div>

        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-100 p-6">
          <p className="text-sm font-semibold text-emerald-900 mb-4">Nesta simulação, sua compra apoiaria:</p>
          <div className="grid grid-cols-2 gap-3">
            <Impact emoji="👨‍🌾" value={order.impact?.producersSupported ?? 0} label="produtores apoiados" />
            <Impact emoji="💰" value={dinheiro(order.impact?.amountToProducers)} label="para os produtores" />
            <Impact emoji="🌱" value={order.impact?.sustainablePractices ?? 0} label="práticas sustentáveis" />
            <Impact emoji="🤝" value={order.impact?.cooperativas ?? 0} label="cooperativas" />
          </div>
          <p className="mt-4 text-center text-sm text-emerald-800/80 italic">
            “Você não está apenas comprando um produto. Está escolhendo valorizar quem produz.”
          </p>
        </motion.div>

        <div className="mt-6">
          <Comprovante pedido={order} />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate("/pedidos")} className="px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm">Ver meus pedidos</button>
          <button onClick={() => navigate("/produtos")} className="px-5 py-3 rounded-full bg-card border border-border font-semibold text-sm">Continuar comprando</button>
        </div>
      </div>
    );
  }

  // EMPTY
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto"><RaizinhoMascot size={140} art="thinking" contextMessage="Seu carrinho está vazio... 🌱" /></div>
        <h1 className="mt-5 font-display text-2xl font-bold text-emerald-950">Seu carrinho está vazio</h1>
        <p className="mt-2 text-muted-foreground">Que tal conhecer produtos de comércio justo?</p>
        <Link to="/produtos" className="mt-6 inline-block px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm">Ver produtos</Link>
      </div>
    );
  }

  // RESUMO / CONFIRMAÇÃO
  if (step === "impact") {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <button onClick={() => setStep("cart")} className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 mb-4">
          <ArrowLeft size={15} /> Voltar ao carrinho
        </button>
        <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-2"><Leaf size={22} className="text-amber-300" /><h1 className="font-display text-2xl font-bold">Resumo do pedido demonstrativo</h1></div>
          <p className="mt-1 text-emerald-100/80 text-sm">Confira os itens e o impacto antes de confirmar a simulação.</p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100/70 mb-2">
              Itens ({itemCount})
            </p>
            <ul className="space-y-1.5 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3">
                  <span className="truncate">{i.qty}× {i.product.name}</span>
                  <span className="shrink-0">{dinheiro(i.product.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 space-y-3">
            <Row icon={Users} value={`${producersSupported} pequenos produtores`} />
            <Row icon={Coins} value={`${dinheiro(amountToProducers)} destinados aos produtores`} />
            <Row icon={Leaf} value={`${sustainablePractices} prática(s) sustentável(is) incentivadas`} />
            <Row icon={MapPin} value={`${distance} km de distância média dos produtores`} />
            <Row icon={Handshake} value={`${cooperativas} cooperativa(s) envolvida(s)`} />
          </div>

          <div className="mt-5 flex justify-between text-sm"><span>Total do pedido</span><span className="font-bold">{dinheiro(total)}</span></div>
          <button onClick={handleConfirm} disabled={placing} className="mt-4 w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2">
            {placing ? <><Loader2 size={18} className="animate-spin" /> Confirmando…</> : "Confirmar simulação demonstrativa"}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-emerald-100/70">
            <ShieldCheck size={13} /> Sem cartão, CPF ou endereço. Nada é cobrado e nada é enviado a produtores.
          </p>
        </div>
      </div>
    );
  }

  // CARRINHO
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-950">🛒 Carrinho</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {itemCount} item(ns) · {items.length} produto(s) · compra demonstrativa
          </p>
        </div>
        <Link to="/produtos" className="text-sm font-semibold text-emerald-700 hover:underline">
          Continuar comprando
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((i) => (
          <div key={i.id} className="flex items-center gap-4 rounded-2xl bg-card border border-border p-3">
            <img src={i.product.image} alt={i.product.name} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-emerald-950 text-sm truncate">{i.product.emoji} {i.product.name}</p>
              <p className="text-xs text-muted-foreground">{i.product.city}–{i.product.state}</p>
              <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                {dinheiro(i.product.price)} <span className="text-xs font-normal text-muted-foreground">/ {i.product.unidade || "unidade"}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(i.id, i.qty - 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center" aria-label="Diminuir quantidade"><Minus size={14} /></button>
              <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
              <button onClick={() => setQty(i.id, i.qty + 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center" aria-label="Aumentar quantidade"><Plus size={14} /></button>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-bold text-emerald-950">{dinheiro(i.product.price * i.qty)}</p>
              <button onClick={() => removeFromCart(i.id)} className="text-xs text-red-500 flex items-center gap-1 ml-auto mt-1"><Trash2 size={12} /> Remover</button>
            </div>
            <button onClick={() => removeFromCart(i.id)} className="sm:hidden text-red-500" aria-label="Remover item"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={esvaziar} className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
          <Trash2 size={13} /> Esvaziar carrinho
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
        <div className="flex justify-between text-sm"><span>Itens</span><span>{itemCount}</span></div>
        <div className="flex justify-between text-sm mt-1"><span>Subtotal</span><span>{dinheiro(total)}</span></div>
        <div className="flex justify-between text-sm text-emerald-700 mt-1"><span>Pontos que você ganharia</span><span>+{pontosGanhos} pts</span></div>
        <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-emerald-200"><span>Total</span><span className="text-emerald-800">{dinheiro(total)}</span></div>
        <p className="mt-3 text-xs text-emerald-900/70 bg-white/60 rounded-lg p-2 text-center">
          {isAuthenticated
            ? "Pedido demonstrativo: nada é cobrado e nenhum envio é feito."
            : "Você pode finalizar como convidado, sem criar conta. É só uma simulação."}
        </p>
        <button onClick={() => setStep("impact")} className="mt-4 w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors active:scale-95">
          Finalizar pedido demonstrativo
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Sem pagamento real, sem cartão e sem cadastro obrigatório.</p>
      </div>
    </div>
  );
}

function Row({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
      <Icon size={20} className="text-amber-300 shrink-0" />
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Impact({ emoji, value, label }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="text-xl font-extrabold text-emerald-800">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}