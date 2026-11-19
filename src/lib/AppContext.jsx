import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useConta } from "@/lib/ContaContext";
import { chave, ler, gravar } from "@/lib/store/storage";
import { emitRaizinho } from "@/lib/raizinhoBus";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user, isAuthenticated, atualizarPerfil } = useConta();
  const uid = user?.id || "convidado";
  const uidRef = useRef(uid);

  const [pontos, setPontos] = useState(user?.pontos ?? 0);
  const [carrinho, setCarrinho] = useState(() => ler(chave("carrinho", uid), []));
  const [favoritos, setFavoritos] = useState(() => ler(chave("favoritos", uid), []));
  const [produtoresVisitados, setProdutoresVisitados] = useState(user?.produtoresVisitados ?? []);
  const [produtosScaneados, setProdutosScaneados] = useState(user?.produtosScaneados ?? []);
  const [stats, setStats] = useState({
    compras: user?.compras ?? 0,
    produtoresApoiados: user?.produtoresApoiados ?? 0,
    produtosComprados: user?.produtosComprados ?? 0,
  });
  const [lastOrderAt, setLastOrderAt] = useState(0);
  const [ready, setReady] = useState(false);

  // Carrega os dados pelo identificador da conta (inclui convidado).
  useEffect(() => {
    const anterior = uidRef.current;
    if (anterior === uid && ready) return;
    uidRef.current = uid;

    // Ao criar a conta, o carrinho montado como convidado é preservado.
    const salvo = ler(chave("carrinho", uid), []);
    const doConvidado =
      anterior === "convidado" && uid !== "convidado" ? ler(chave("carrinho", "convidado"), []) : [];
    const mesclado = [...salvo];
    doConvidado.forEach((item) => {
      if (!mesclado.find((i) => i.id === item.id)) mesclado.push(item);
    });
    if (mesclado.length !== salvo.length) gravar(chave("carrinho", uid), mesclado);

    setCarrinho(mesclado);
    setFavoritos(ler(chave("favoritos", uid), []));
    setPontos(user?.pontos ?? 0);
    setStats({
      compras: user?.compras ?? 0,
      produtoresApoiados: user?.produtoresApoiados ?? 0,
      produtosComprados: user?.produtosComprados ?? 0,
    });
    setProdutoresVisitados(user?.produtoresVisitados ?? []);
    setProdutosScaneados(user?.produtosScaneados ?? []);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const persistUser = useCallback(
    async (patch) => {
      if (!isAuthenticated) return;
      try {
        await atualizarPerfil(patch);
      } catch {
        /* melhor esforço: os dados continuam na sessão local */
      }
    },
    [atualizarPerfil, isAuthenticated]
  );

  const addPontos = useCallback(
    (n) => {
      setPontos((p) => {
        const novo = p + n;
        persistUser({ pontos: novo });
        emitRaizinho("points", { n });
        return novo;
      });
    },
    [persistUser]
  );

  const aplicarCarrinho = useCallback(
    (transformar) => {
      setCarrinho((atual) => {
        const novo = transformar(atual);
        gravar(chave("carrinho", uid), novo);
        return novo;
      });
    },
    [uid]
  );

  const addToCart = useCallback(
    (productId, qty = 1) => {
      aplicarCarrinho((atual) => {
        const existente = atual.find((i) => i.id === productId);
        return existente
          ? atual.map((i) => (i.id === productId ? { ...i, qty: i.qty + qty } : i))
          : [...atual, { id: productId, qty }];
      });
      emitRaizinho("cart_add", { productId });
    },
    [aplicarCarrinho]
  );

  const setQty = useCallback(
    (productId, qty) => {
      aplicarCarrinho((atual) =>
        qty <= 0 ? atual.filter((i) => i.id !== productId) : atual.map((i) => (i.id === productId ? { ...i, qty } : i))
      );
    },
    [aplicarCarrinho]
  );

  const removeFromCart = useCallback(
    (productId) => aplicarCarrinho((atual) => atual.filter((i) => i.id !== productId)),
    [aplicarCarrinho]
  );

  const clearCart = useCallback(() => aplicarCarrinho(() => []), [aplicarCarrinho]);

  const ehFavorito = useCallback((productId) => favoritos.includes(productId), [favoritos]);

  const toggleFavorito = useCallback(
    (productId) => {
      if (!isAuthenticated) return false;
      setFavoritos((atual) => {
        const novo = atual.includes(productId)
          ? atual.filter((id) => id !== productId)
          : [...atual, productId];
        gravar(chave("favoritos", uid), novo);
        return novo;
      });
      return true;
    },
    [isAuthenticated, uid]
  );

  const recordPurchase = useCallback(
    ({ itemCount, producersCount, pontosGanhos }) => {
      setStats((atual) => {
        const novo = {
          compras: atual.compras + 1,
          produtoresApoiados: atual.produtoresApoiados + producersCount,
          produtosComprados: atual.produtosComprados + itemCount,
        };
        persistUser(novo);
        return novo;
      });
      if (pontosGanhos) addPontos(pontosGanhos);
      setLastOrderAt(Date.now());
      emitRaizinho("purchase", { itemCount, pontosGanhos });
    },
    [persistUser, addPontos]
  );

  const visitProducer = useCallback(
    (id) => {
      setProdutoresVisitados((anterior) => {
        if (anterior.includes(id)) return anterior;
        persistUser({ produtoresVisitados: [...anterior, id] });
        addPontos(10);
        return [...anterior, id];
      });
    },
    [persistUser, addPontos]
  );

  const scanProduct = useCallback(
    (id) => {
      setProdutosScaneados((anterior) => {
        if (anterior.includes(id)) return anterior;
        persistUser({ produtosScaneados: [...anterior, id] });
        addPontos(20);
        return [...anterior, id];
      });
    },
    [persistUser, addPontos]
  );

  const value = {
    user,
    isAuthenticated,
    ready,
    pontos,
    carrinho,
    favoritos,
    ehFavorito,
    toggleFavorito,
    stats,
    compras: stats.compras,
    produtoresApoiados: stats.produtoresApoiados,
    produtosComprados: stats.produtosComprados,
    lastOrderAt,
    produtoresVisitados,
    produtosScaneados,
    addPontos,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    recordPurchase,
    visitProducer,
    scanProduct,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}