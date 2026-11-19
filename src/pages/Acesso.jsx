import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Tractor, Compass, ArrowRight, Check, Sprout } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AvisoModoLocal from "@/components/auth/AvisoModoLocal";
import { useConta } from "@/lib/ContaContext";

const OPCOES = [
  {
    tipo: "comprador",
    icon: ShoppingBasket,
    titulo: "Sou comprador",
    resumo: "Quero comprar direto de quem produz, com preço justo.",
    itens: [
      "Explorar o catálogo completo da agricultura familiar",
      "Salvar produtos favoritos",
      "Montar o carrinho e acompanhar pedidos",
      "Ver o impacto de cada compra",
    ],
    classes: {
      borda: "border-emerald-200 hover:border-emerald-400",
      icone: "bg-emerald-100 text-emerald-700",
      botao: "bg-emerald-800 hover:bg-emerald-900 text-white",
      check: "text-emerald-600",
    },
  },
  {
    tipo: "vendedor",
    icon: Tractor,
    titulo: "Sou vendedor",
    resumo: "Quero vender a produção da minha propriedade.",
    itens: [
      "Cadastrar a propriedade e os tipos de produto",
      "Publicar, editar preços e atualizar a disponibilidade",
      "Gerenciar o catálogo próprio",
      "Acessar o painel do vendedor",
    ],
    classes: {
      borda: "border-amber-200 hover:border-amber-400",
      icone: "bg-amber-100 text-amber-700",
      botao: "bg-amber-500 hover:bg-amber-600 text-white",
      check: "text-amber-600",
    },
  },
];

export default function Acesso() {
  const navigate = useNavigate();
  const { user, isAuthenticated, continuarComoConvidado } = useConta();

  const entrarComoConvidado = () => {
    continuarComoConvidado();
    navigate("/");
  };

  return (
    <AuthShell wide voltar="/" voltarLabel="Ir para a página inicial">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Sprout size={13} /> Comércio Justo · Agricultura familiar
        </span>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold text-emerald-950 text-balance">
          Bem-vindo ao RaizJusta
        </h1>
        <p className="mt-3 text-emerald-900/70">Como você deseja acessar nossa feira digital?</p>
      </div>

      <div className="mt-7 max-w-2xl mx-auto">
        <AvisoModoLocal />
      </div>

      {isAuthenticated && (
        <div className="max-w-2xl mx-auto mb-6 rounded-3xl bg-emerald-900 text-white p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-emerald-100/70">Você já está conectado</p>
            <p className="font-bold text-lg">{user?.full_name || user?.email}</p>
            <p className="text-xs text-emerald-100/60 capitalize">Conta de {user?.tipo}</p>
          </div>
          <Link
            to={user?.tipo === "vendedor" ? "/painel-vendedor" : "/"}
            className="px-5 py-3 rounded-full bg-white text-emerald-900 text-sm font-semibold text-center"
          >
            {user?.tipo === "vendedor" ? "Abrir meu painel" : "Continuar comprando"}
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {OPCOES.map((opcao) => (
          <div
            key={opcao.tipo}
            className={`rounded-3xl bg-card border ${opcao.classes.borda} p-6 shadow-sm transition-colors flex flex-col`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${opcao.classes.icone}`}>
              <opcao.icon size={24} />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-emerald-950">{opcao.titulo}</h2>
            <p className="text-sm text-muted-foreground mt-1">{opcao.resumo}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {opcao.itens.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-emerald-900/80">
                  <Check size={15} className={`mt-0.5 shrink-0 ${opcao.classes.check}`} /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                to={`/entrar?tipo=${opcao.tipo}`}
                className={`px-5 py-3 rounded-2xl text-sm font-semibold text-center transition-colors ${opcao.classes.botao}`}
              >
                Entrar
              </Link>
              <Link
                to={`/criar-conta?tipo=${opcao.tipo}`}
                className="px-5 py-3 rounded-2xl bg-card border border-border text-sm font-semibold text-center text-emerald-900 hover:bg-emerald-50"
              >
                Criar conta de {opcao.tipo}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 max-w-4xl mx-auto rounded-3xl bg-white/70 border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center shrink-0">
          <Compass size={24} />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold text-emerald-950">Continuar como convidado</h2>
          <p className="text-sm text-muted-foreground">
            Explore produtos, busque, filtre, conheça os produtores e leia sobre comércio justo sem criar conta.
          </p>
        </div>
        <button
          onClick={entrarComoConvidado}
          className="px-5 py-3 rounded-2xl bg-card border border-emerald-300 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 flex items-center gap-2"
        >
          Explorar a feira <ArrowRight size={16} />
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground max-w-lg mx-auto">
        No modo convidado, favoritos, carrinho persistente e pedidos ficam disponíveis após criar uma conta gratuita.
      </p>
    </AuthShell>
  );
}