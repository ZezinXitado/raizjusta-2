# RELATÓRIO DE EXTRAÇÃO — RAIZJUSTA (Base44)

- Arquivos encontrados no editor: 159
- Copiados com sucesso: 159
- Com erro: 0
- Não copiados: nenhum
- Verificação: 159 arquivos em disco; total de 572.212 caracteres, idêntico à soma dos tamanhos lidos do editor; nenhum arquivo vazio.

## Método
Todas as pastas foram expandidas; cada arquivo foi aberto no editor e o conteúdo integral lido do modelo Monaco, e gravado em disco sem alteração. Nada foi modificado, publicado ou implantado no Base44.

## Limitações
- O editor está em modo somente leitura (edição exige plano pago); não havia opção de exportação nativa testada.
- Arquivos binários/imagens não aparecem na árvore do editor, logo não foram copiados.
- A comparação foi por contagem e total de caracteres, não por hash arquivo a arquivo.
- Dois a três arquivos precisaram de nova tentativa de leitura e foram copiados na segunda passagem.

## Estrutura
```
raizjusta/
├── base44/
│   ├── entities/
│   │   ├── Order.jsonc
│   │   └── User.jsonc
│   └── config.jsonc
├── src/
│   ├── api/
│   │   └── base44Client.js
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthShell.jsx
│   │   │   ├── AvisoModoLocal.jsx
│   │   │   └── CampoAuth.jsx
│   │   ├── catalog/
│   │   │   └── FiltrosCatalogo.jsx
│   │   ├── perfil/
│   │   │   └── DadosConta.jsx
│   │   ├── raizinho/
│   │   │   ├── actions.js
│   │   │   ├── engine.js
│   │   │   ├── expressions.js
│   │   │   ├── model.js
│   │   │   ├── modes.js
│   │   │   ├── particles.js
│   │   │   └── SpeechBubble.jsx
│   │   ├── ui/
│   │   │   ├── accordion.jsx
│   │   │   ├── alert-dialog.jsx
│   │   │   ├── alert.jsx
│   │   │   ├── aspect-ratio.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── breadcrumb.jsx
│   │   │   ├── button.jsx
│   │   │   ├── calendar.jsx
│   │   │   ├── card.jsx
│   │   │   ├── carousel.jsx
│   │   │   ├── chart.jsx
│   │   │   ├── checkbox.jsx
│   │   │   ├── collapsible.jsx
│   │   │   ├── command.jsx
│   │   │   ├── context-menu.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── drawer.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── form.jsx
│   │   │   ├── hover-card.jsx
│   │   │   ├── image-helpers.js
│   │   │   ├── image.jsx
│   │   │   ├── input-otp.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── menubar.jsx
│   │   │   ├── navigation-menu.jsx
│   │   │   ├── pagination.jsx
│   │   │   ├── popover.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── radio-group.jsx
│   │   │   ├── resizable.jsx
│   │   │   ├── responsive-image.jsx
│   │   │   ├── scroll-area.jsx
│   │   │   ├── select.jsx
│   │   │   ├── separator.jsx
│   │   │   ├── sheet.jsx
│   │   │   ├── sidebar.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── slider.jsx
│   │   │   ├── sonner.jsx
│   │   │   ├── switch.jsx
│   │   │   ├── table.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── toast.jsx
│   │   │   ├── toaster.jsx
│   │   │   ├── toggle-group.jsx
│   │   │   ├── toggle.jsx
│   │   │   ├── tooltip.jsx
│   │   │   ├── use-responsive-image.jsx
│   │   │   └── use-toast.jsx
│   │   ├── vendedor/
│   │   │   ├── PedidosRecebidos.jsx
│   │   │   └── ProdutoForm.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── CategoryPill.jsx
│   │   ├── GoogleIcon.jsx
│   │   ├── GuardaConta.jsx
│   │   ├── ImpactCounter.jsx
│   │   ├── Layout.jsx
│   │   ├── Logo.jsx
│   │   ├── MascotPanel.jsx
│   │   ├── MfaFlow.jsx
│   │   ├── MfaManage.jsx
│   │   ├── MfaMethodSetup.jsx
│   │   ├── MfaParts.jsx
│   │   ├── Navbar.jsx
│   │   ├── PriceBreakdown.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── QRPassport.jsx
│   │   ├── RaizinhoCompanion.jsx
│   │   ├── RaizinhoMascot.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── UserNotRegisteredError.jsx
│   ├── data/
│   │   ├── catalogoCompleto.js
│   │   ├── estados.js
│   │   └── mockData.js
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── use-size.jsx
│   ├── lib/
│   │   ├── services/
│   │   │   ├── auth.js
│   │   │   └── firebase.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── orders.js
│   │   │   ├── sellerProducts.js
│   │   │   └── storage.js
│   │   ├── app-params.js
│   │   ├── AppContext.jsx
│   │   ├── AuthContext.jsx
│   │   ├── authMfa.js
│   │   ├── authMfaFlow.js
│   │   ├── authReturnTo.js
│   │   ├── catalogo.js
│   │   ├── ContaContext.jsx
│   │   ├── PageNotFound.jsx
│   │   ├── query-client.js
│   │   ├── raizinhoBus.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── Acesso.jsx
│   │   ├── Cart.jsx
│   │   ├── CriarConta.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Educational.jsx
│   │   ├── Entrar.jsx
│   │   ├── Favoritos.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── GuiaExportacao.jsx
│   │   ├── Home.jsx
│   │   ├── Impact.jsx
│   │   ├── Login.jsx
│   │   ├── MapPage.jsx
│   │   ├── Mfa.jsx
│   │   ├── NaoEncontrado.jsx
│   │   ├── OAuthConsent.jsx
│   │   ├── Orders.jsx
│   │   ├── PainelVendedor.jsx
│   │   ├── Passport.jsx
│   │   ├── Producer.jsx
│   │   ├── ProducerDashboard.jsx
│   │   ├── Producers.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   ├── RecuperarSenha.jsx
│   │   ├── Register.jsx
│   │   └── ResetPassword.jsx
│   ├── utils/
│   │   └── index.ts
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```
