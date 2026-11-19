import React from "react";

export default function CampoAuth({ label, erro, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900/60">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && !erro && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
    </label>
  );
}

export const inputAuth =
  "w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15";