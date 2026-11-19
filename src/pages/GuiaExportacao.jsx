import React from "react";
import { Link } from "react-router-dom";
import { Download, KeyRound, Database, FolderTree, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

const VARIAVEIS = [
  ["VITE_FIREBASE_API_KEY", "Chave pública do app Web no console do Firebase"],
  ["VITE_FIREBASE_AUTH_DOMAIN", "ex.: seu-projeto.firebaseapp.com"],
  ["VITE_FIREBASE_PROJECT_ID", "ID do projeto Firebase"],
  ["VITE_FIREBASE_APP_ID", "App ID do app Web"],
  ["VITE_FIREBASE_STORAGE_BUCKET", "Opcional — só se for usar Storage"],
  ["VITE_FIREBASE_MESSAGING_SENDER_ID", "Opcional — só se for usar mensageria"],
];

const ARQUIVOS = [
  "src/ (todas as páginas, componentes, dados e serviços)",
  "index.html",
  "package.json e package-lock.json",
  "vite.config.js, tailwind.config.js, postcss.config.js",
  "jsconfig.json e components.json",
];

const REGRAS = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function logado() { return request.auth != null; }

    match /usuarios/{uid} {
      allow read: if logado();
      allow create: if logado() && request.auth.uid == uid
        && request.resource.data.tipo in ['comprador', 'vendedor'];
      // o tipo de conta não pode ser alterado depois de criado
      allow update: if logado() && request.auth.uid == uid
        && request.resource.data.tipo == resource.data.tipo;
      allow delete: if false;
    }

    match /produtos/{id} {
      allow read: if true;
      allow create: if logado()
        && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if logado()
        && resource.data.ownerId == request.auth.uid;
    }

    match /pedidos/{id} {
      allow read, create: if logado()
        && request.resource.data.compradorId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}`;

export default function GuiaExportacao() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline mb-4">
        <ArrowLeft size={16} /> Voltar ao início
      </Link>

      <h1 className="font-display text-3xl font-bold text-emerald-950">Guia de exportação</h1>
      <p className="text-muted-foreground mt-1">
        O RaizJusta foi construído em React + Vite e não depende de banco de dados, autenticação ou funções da
        plataforma para funcionar. Copie a pasta do projeto e publique em qualquer hospedagem estática.
      </p>

      <div className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-100 p-5 flex gap-3">
        <CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900/90">
          <p className="font-semibold">Funciona hoje, sem configurar nada</p>
          <p className="mt-1">
            Catálogo de 58 produtos demonstrativos, busca, filtros, carrinho, favoritos, painel do vendedor e modo
            convidado. A autenticação roda em modo local de demonstração.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-3xl bg-card border border-border p-5 sm:p-6">
        <h2 className="font-bold text-emerald-950 flex items-center gap-2">
          <KeyRound size={18} className="text-emerald-700" /> Variáveis de ambiente
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Crie um arquivo <code className="bg-muted px-1 rounded">.env</code> na raiz do projeto com estas chaves.
          Apenas chaves públicas do app Web — nunca coloque chaves administrativas no frontend.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Variável</th>
                <th className="py-2">Para que serve</th>
              </tr>
            </thead>
            <tbody>
              {VARIAVEIS.map(([nome, descricao]) => (
                <tr key={nome} className="border-t border-border">
                  <td className="py-2 pr-4 font-mono text-xs text-emerald-800">{nome}</td>
                  <td className="py-2 text-muted-foreground">{descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Sem essas variáveis, o app usa o modo local de demonstração e mostra um aviso nas telas de acesso.
        </p>
      </section>

      <section className="mt-6 rounded-3xl bg-card border border-border p-5 sm:p-6">
        <h2 className="font-bold text-emerald-950 flex items-center gap-2">
          <Database size={18} className="text-emerald-700" /> Regras do Firestore
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          O tipo de conta fica em <code className="bg-muted px-1 rounded">usuarios/{"{uid}"}</code> e a edição de
          produtos é restrita ao dono. Publique estas regras no console do Firebase.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-emerald-950 text-emerald-100 text-xs p-4 leading-relaxed">
          {REGRAS}
        </pre>
      </section>

      <section className="mt-6 rounded-3xl bg-card border border-border p-5 sm:p-6">
        <h2 className="font-bold text-emerald-950 flex items-center gap-2">
          <FolderTree size={18} className="text-emerald-700" /> Arquivos para copiar
        </h2>
        <ul className="mt-3 space-y-2">
          {ARQUIVOS.map((arquivo) => (
            <li key={arquivo} className="flex items-start gap-2 text-sm text-emerald-900/80">
              <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 shrink-0" /> {arquivo}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          A pasta <code className="bg-muted px-1 rounded">base44/</code> e a dependência{" "}
          <code className="bg-muted px-1 rounded">@base44/sdk</code> não são usadas pelo aplicativo. Depois de copiar,
          rode <code className="bg-muted px-1 rounded">npm install</code> e{" "}
          <code className="bg-muted px-1 rounded">npm run build</code>.
        </p>
      </section>

      <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-200 p-5 flex gap-3">
        <AlertTriangle size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">O que depende do Firebase</p>
          <p className="mt-1">
            Cadastro, login, recuperação de senha por e-mail e catálogo compartilhado entre usuários só funcionam
            depois de configurar o Firebase. Enquanto isso, as contas, favoritos, carrinho e produtos cadastrados
            ficam apenas no navegador. Nada é enviado a servidores.
          </p>
        </div>
      </div>

      <Link
        to="/produtos"
        className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-800 text-white font-semibold text-sm"
      >
        <Download size={16} /> Ver o catálogo demonstrativo
      </Link>
    </div>
  );
}