import React from "react";
import { Info, ShieldCheck } from "lucide-react";
import { useConta } from "@/lib/ContaContext";

export default function AvisoModoLocal() {
  const { firebaseAtivo, avisoModoLocal } = useConta();
  if (firebaseAtivo) {
    return (
      <div className="mb-5 flex items-start gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-900/80">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-700" />
        <span>Login seguro pelo Firebase Authentication. Sua senha nunca é armazenada no navegador.</span>
      </div>
    );
  }
  return (
    <div className="mb-5 flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
      <Info size={16} className="mt-0.5 shrink-0" />
      <span>{avisoModoLocal}</span>
    </div>
  );
}