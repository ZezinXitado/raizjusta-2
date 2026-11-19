import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as auth from "@/lib/services/auth";

const ContaContext = createContext(null);

export function ContaProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let ativo = true;
    auth
      .sessaoAtual()
      .then((sessao) => {
        if (ativo) setUser(sessao);
      })
      .catch(() => {
        if (ativo) setUser(null);
      })
      .finally(() => {
        if (ativo) setIsLoadingAuth(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (dados) => {
    const conta = await auth.entrar(dados);
    setUser(conta);
    return conta;
  }, []);

  const criarConta = useCallback(async (dados) => {
    const conta = await auth.criarConta(dados);
    setUser(conta);
    return conta;
  }, []);

  const continuarComoConvidado = useCallback(() => {
    setUser(auth.continuarComoConvidadoLocal());
  }, []);

  const atualizarPerfil = useCallback(
    async (patch) => {
      if (!user) return null;
      const atualizado = await auth.atualizarPerfil(user, patch);
      setUser(atualizado);
      return atualizado;
    },
    [user]
  );

  const logout = useCallback(async (redirecionar = true) => {
    await auth.sair();
    setUser(null);
    if (redirecionar) window.location.href = `${import.meta.env.BASE_URL}#/acesso`;
  }, []);

  const navigateToLogin = useCallback(() => {
    window.location.href = `${import.meta.env.BASE_URL}#/acesso`;
  }, []);

  const isAuthenticated = Boolean(user) && user.tipo !== "convidado";

  const value = {
    user,
    isAuthenticated,
    isGuest: user?.tipo === "convidado",
    isComprador: user?.tipo === "comprador",
    isVendedor: user?.tipo === "vendedor",
    isLoadingAuth,
    isLoadingPublicSettings: false,
    authError: null,
    authChecked: !isLoadingAuth,
    modoAuth: auth.modoAuth,
    firebaseAtivo: auth.firebaseAtivo,
    avisoModoLocal: auth.AVISO_MODO_LOCAL,
    entrar,
    criarConta,
    recuperarSenha: auth.recuperarSenha,
    atualizarPerfil,
    continuarComoConvidado,
    sair: logout,
    logout,
    navigateToLogin,
  };

  return <ContaContext.Provider value={value}>{children}</ContaContext.Provider>;
}

export function useConta() {
  const contexto = useContext(ContaContext);
  if (!contexto) throw new Error("useConta precisa estar dentro de ContaProvider");
  return contexto;
}