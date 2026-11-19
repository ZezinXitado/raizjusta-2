// Catálogo demonstrativo da agricultura familiar do RaizJusta.
// TODOS os produtos, preços e produtores são FICTÍCIOS e servem para
// demonstrar o conceito de comércio justo. Nenhum item é um anúncio real.

const IMG = "https://media.base44.com/images/public/6aa2e98f7c1eba657fbc135d";

export const IMAGENS_CATEGORIA = {
  cafe: `${IMG}/8246a6710_generated_image.png`,
  mel: `${IMG}/b18fa1367_generated_image.png`,
  cacau: `${IMG}/13e7bcbc6_generated_image.png`,
  frutas: `${IMG}/eecd70b51_generated_image.png`,
  graos: `${IMG}/13ee40d5b_generated_image.png`,
  castanhas: `${IMG}/bfa96969e_generated_image.png`,
  artesanais: `${IMG}/0fd662d1c_generated_image.png`,
  naturais: `${IMG}/92b2baa4c_generated_image.png`,
  hortaliccas: `${IMG}/631c442a7_generated_image.png`,
  kits: `${IMG}/1499801f0_generated_image.png`,
  raizes: `${IMG}/17958ecb6_generated_image.png`,
  animal: `${IMG}/d89ca35b4_generated_image.png`,
  ovos: `${IMG}/1f87ac7a1_generated_image.png`,
  farinhas: `${IMG}/eb0ab4a0f_generated_image.png`,
};

export const categoriasFamiliares = [
  { key: "raizes", label: "Raízes e tubérculos", emoji: "🍠", image: IMAGENS_CATEGORIA.raizes },
  { key: "animal", label: "Ovos e laticínios", emoji: "🥚", image: IMAGENS_CATEGORIA.animal },
  { key: "farinhas", label: "Farinhas e derivados", emoji: "🌾", image: IMAGENS_CATEGORIA.farinhas },
];

export const produtoresFamiliares = [
  {
    id: "raimundo-graos",
    name: "Raimundo Pereira",
    avatar: `${IMG}/3018da939_generated_image.png`,
    role: "Produtor de grãos",
    city: "Sorriso",
    state: "MT",
    bio: "Raimundo cultiva arroz e feijão em sistema de rotação de culturas com a família há três gerações, vendendo direto para consumidores e cooperativas locais.",
    badges: ["Produção sustentável", "Comércio justo", "Venda direta", "Agricultura familiar"],
    impact: { rendaPct: 34, produtosVendidos: 210, familias: 18 },
  },
  {
    id: "dona-rosa-raizes",
    name: "Rosa de Nazaré",
    avatar: `${IMG}/91c99c1cf_generated_image.png`,
    role: "Produtora de raízes",
    city: "Itapecuru-Mirim",
    state: "MA",
    bio: "Dona Rosa produz mandioca, batata-doce e inhame em roçado familiar, com reaproveitamento dos restos da colheita na alimentação animal.",
    badges: ["Agricultura familiar", "Comércio justo", "Venda direta", "Produção sustentável"],
    impact: { rendaPct: 31, produtosVendidos: 150, familias: 11 },
  },
  {
    id: "cleide-farinhas",
    name: "Cleide Alves",
    avatar: `${IMG}/3321f6d8c_generated_image.png`,
    role: "Produtora de farinhas",
    city: "Pirenópolis",
    state: "GO",
    bio: "Cleide transforma a mandioca da própria roça em farinha, polvilho e beiju no forno de barro da família, mantendo o modo artesanal de produção.",
    badges: ["Produção artesanal", "Comércio justo", "Venda direta", "Agricultura familiar"],
    impact: { rendaPct: 36, produtosVendidos: 180, familias: 14 },
  },
];

const arredondar = (valor) => Math.round(valor * 100) / 100;

function criar(id, nome, categoria, preco, unidade, produtorId, extra = {}) {
  return {
    id,
    name: nome,
    emoji: extra.emoji || "🌱",
    category: categoria,
    image: IMAGENS_CATEGORIA[extra.imagem || categoria] || IMAGENS_CATEGORIA.artesanais,
    producerId: produtorId,
    price: preco,
    unidade,
    rating: extra.rating ?? 4.8,
    fairTradePct: extra.fairTradePct ?? 92,
    sustainable: extra.sustainable ?? true,
    disponivel: extra.disponivel ?? true,
    description: extra.description,
    badges: extra.badges || ["Comércio justo", "Agricultura familiar", "Venda direta", "Origem rastreável"],
    breakdown: {
      produtor: arredondar(preco * 0.7),
      logistica: arredondar(preco * 0.15),
      plataforma: arredondar(preco * 0.1),
      fundo: arredondar(preco * 0.05),
    },
    demo: true,
  };
}

const GRAOS = "graos";
const RAIZES = "raizes";
const VERDURAS = "hortaliccas";
const FRUTAS = "frutas";
const ANIMAL = "animal";
const FARINHAS = "farinhas";
const ARTESANAIS = "artesanais";

export const produtosFamiliares = [
  // ---------- GRÃOS E CEREAIS ----------
  criar("arroz-branco", "Arroz Branco", GRAOS, 6.5, "kg", "raimundo-graos", {
    emoji: "🍚", imagem: "graos",
    description: "Arroz branco beneficiado na própria comunidade, colhido no Cerrado mato-grossense.",
  }),
  criar("arroz-integral", "Arroz Integral", GRAOS, 8.0, "kg", "raimundo-graos", {
    emoji: "🍚", imagem: "graos", fairTradePct: 94,
    description: "Arroz integral com casca preservada, mais fibra e sabor de produção familiar.",
  }),
  criar("arroz-parboilizado", "Arroz Parboilizado", GRAOS, 7.2, "kg", "raimundo-graos", {
    emoji: "🍚", imagem: "graos",
    description: "Arroz parboilizado artesanalmente, mantendo mais nutrientes no grão.",
  }),
  criar("feijao-carioca", "Feijão Carioca", GRAOS, 9.5, "kg", "raimundo-graos", {
    emoji: "🫘", imagem: "graos",
    description: "Feijão carioca da safra atual, sem aditivos e seco naturalmente ao sol.",
  }),
  criar("feijao-preto", "Feijão Preto", GRAOS, 10.0, "kg", "raimundo-graos", {
    emoji: "🫘", imagem: "graos",
    description: "Feijão preto graúdo, ideal para a feijoada da família.",
  }),
  criar("feijao-corda", "Feijão-de-Corda", GRAOS, 12.0, "500 g", "dona-rosa-raizes", {
    emoji: "🫘", imagem: "graos", rating: 4.9,
    description: "Feijão-de-corda fresco do roçado maranhense, colhido à mão.",
  }),
  criar("feijao-fradinho", "Feijão-Fradinho", GRAOS, 11.5, "500 g", "dona-rosa-raizes", {
    emoji: "🫘", imagem: "graos",
    description: "Feijão-fradinho selecionado, perfeito para acarajé e saladas.",
  }),
  criar("milho-verde", "Milho Verde", GRAOS, 4.5, "6 espigas", "dona-rosa-raizes", {
    emoji: "🌽", imagem: "graos", disponivel: false,
    description: "Milho verde colhido na semana, doce e macio. Produção sazonal.",
  }),
  criar("milho-canjica", "Milho para Canjica", GRAOS, 7.0, "kg", "raimundo-graos", {
    emoji: "🌽", imagem: "graos",
    description: "Milho seco para canjica e cuscuz, moído no moinho da comunidade.",
  }),

  // ---------- RAÍZES E TUBÉRCULOS ----------
  criar("mandioca", "Mandioca", RAIZES, 5.0, "kg", "dona-rosa-raizes", {
    emoji: "🍠", imagem: "raizes",
    description: "Mandioca fresca de roçado familiar, colhida no dia do envio.",
  }),
  criar("batata-doce", "Batata-Doce", RAIZES, 6.0, "kg", "dona-rosa-raizes", {
    emoji: "🍠", imagem: "raizes", rating: 4.9,
    description: "Batata-doce de polpa alaranjada, adocicada e rica em vitamina A.",
  }),
  criar("batata-inglesa", "Batata Inglesa", RAIZES, 5.5, "kg", "clara-hortalicas", {
    emoji: "🥔", imagem: "raizes", disponivel: false,
    description: "Batata de primeira safra, cultivada sem uso excessivo de defensivos.",
  }),
  criar("inhame", "Inhame", RAIZES, 7.5, "kg", "dona-rosa-raizes", {
    emoji: "🍠", imagem: "raizes",
    description: "Inhame cremoso do Maranhão, colhido após oito meses de cultivo.",
  }),
  criar("cara", "Cará", RAIZES, 7.0, "kg", "dona-rosa-raizes", {
    emoji: "🍠", imagem: "raizes",
    description: "Cará de casca clara, tradicional em cozidos e sopas regionais.",
  }),

  // ---------- VERDURAS E LEGUMES ----------
  criar("alface", "Alface Crespa", VERDURAS, 3.5, "maço", "clara-hortalicas", {
    emoji: "🥬", imagem: "hortaliccas",
    description: "Alface crespa colhida de manhã, folhas firmes e sem agrotóxico.",
  }),
  criar("couve", "Couve-Manteiga", VERDURAS, 4.0, "maço", "clara-hortalicas", {
    emoji: "🥬", imagem: "hortaliccas",
    description: "Couve-manteiga de folhas largas, colhida no ponto para refogar.",
  }),
  criar("coentro", "Coentro", VERDURAS, 2.5, "maço", "clara-hortalicas", {
    emoji: "🌿", imagem: "hortaliccas", disponivel: false,
    description: "Coentro fresco e aromático, colhido na horta da propriedade.",
  }),
  criar("cheiro-verde", "Cheiro-Verde", VERDURAS, 3.0, "maço", "clara-hortalicas", {
    emoji: "🌿", imagem: "hortaliccas",
    description: "Mistura de salsa e cebolinha picada na hora, direto da horta.",
  }),
  criar("tomate", "Tomate", VERDURAS, 6.8, "kg", "clara-hortalicas", {
    emoji: "🍅", imagem: "hortaliccas", rating: 4.9,
    description: "Tomate maduro no pé, colhido manualmente para manter o sabor.",
  }),
  criar("cebola", "Cebola", VERDURAS, 5.9, "kg", "dona-rosa-raizes", {
    emoji: "🧅", imagem: "hortaliccas",
    description: "Cebola de casca firme, curada ao sol para durar mais na cozinha.",
  }),
  criar("cenoura", "Cenoura", VERDURAS, 5.2, "kg", "clara-hortalicas", {
    emoji: "🥕", imagem: "hortaliccas",
    description: "Cenoura crocante e adocicada, cultivada em canteiro familiar.",
  }),
  criar("abobora", "Abóbora", VERDURAS, 4.8, "kg", "dona-rosa-raizes", {
    emoji: "🎃", imagem: "hortaliccas",
    description: "Abóbora de polpa firme, da variedade crioula preservada na região.",
  }),
  criar("quiabo", "Quiabo", VERDURAS, 6.5, "500 g", "dona-rosa-raizes", {
    emoji: "🌿", imagem: "hortaliccas",
    description: "Quiabo novo, colhido jovem para ficar macio no cozimento.",
  }),
  criar("maxixe", "Maxixe", VERDURAS, 5.5, "500 g", "dona-rosa-raizes", {
    emoji: "🥒", imagem: "hortaliccas", disponivel: false,
    description: "Maxixe do Nordeste, colhido no ponto para refogados. Sazonal.",
  }),
  criar("pepino", "Pepino", VERDURAS, 4.2, "kg", "clara-hortalicas", {
    emoji: "🥒", imagem: "hortaliccas",
    description: "Pepino de horta, com casca fina e textura crocante.",
  }),
  criar("pimentao", "Pimentão", VERDURAS, 5.8, "500 g", "clara-hortalicas", {
    emoji: "🫑", imagem: "hortaliccas",
    description: "Pimentão vermelho e verde, colhido maduro na estufa da roça.",
  }),
  criar("berinjela", "Berinjela", VERDURAS, 5.0, "kg", "clara-hortalicas", {
    emoji: "🍆", imagem: "hortaliccas",
    description: "Berinjela de casca brilhante, sem amargor, ideal para assar.",
  }),

  // ---------- FRUTAS ----------
  criar("banana-prata", "Banana-Prata", FRUTAS, 5.5, "kg", "ana-frutas", {
    emoji: "🍌", imagem: "frutas", rating: 4.9,
    description: "Banana-prata do Vale do São Francisco, colhida no cacho e sem agrotóxico.",
  }),
  criar("banana-da-terra", "Banana-da-Terra", FRUTAS, 6.5, "kg", "ana-frutas", {
    emoji: "🍌", imagem: "frutas",
    description: "Banana-da-terra ideal para fritar, cozinhar e fazer farofa.",
  }),
  criar("manga", "Manga Palmer", FRUTAS, 6.0, "kg", "ana-frutas", {
    emoji: "🥭", imagem: "frutas",
    description: "Manga Palmer madura no pé, com polpa firme e doce.",
  }),
  criar("mamao", "Mamão", FRUTAS, 6.2, "kg", "ana-frutas", {
    emoji: "🍈", imagem: "frutas",
    description: "Mamão de polpa alaranjada, colhido de maturação controlada.",
  }),
  criar("melancia", "Melancia", FRUTAS, 3.8, "kg", "ana-frutas", {
    emoji: "🍉", imagem: "frutas",
    description: "Melancia do sertão pernambucano, doce e cheia de água.",
  }),
  criar("abacaxi", "Abacaxi", FRUTAS, 7.0, "unidade", "ana-frutas", {
    emoji: "🍍", imagem: "frutas", disponivel: false,
    description: "Abacaxi pérola, docíssimo, colhido na safra. Volta em breve.",
  }),
  criar("laranja", "Laranja", FRUTAS, 4.5, "kg", "ana-frutas", {
    emoji: "🍊", imagem: "frutas",
    description: "Laranja de mesa, suculenta e sem cera na casca.",
  }),
  criar("limao", "Limão", FRUTAS, 5.0, "kg", "ana-frutas", {
    emoji: "🍋", imagem: "frutas",
    description: "Limão taiti fresco, colhido a cada dois dias na propriedade.",
  }),
  criar("goiaba", "Goiaba", FRUTAS, 6.8, "kg", "ana-frutas", {
    emoji: "🍐", imagem: "frutas", rating: 4.7,
    description: "Goiaba de polpa vermelha, perfumada e colhida madura.",
  }),
  criar("maracuja", "Maracujá", FRUTAS, 7.5, "kg", "ana-frutas", {
    emoji: "🍈", imagem: "frutas",
    description: "Maracujá-amarelo com muita polpa, do pé para a sua mesa.",
  }),
  criar("coco", "Coco", FRUTAS, 4.0, "unidade", "clara-hortalicas", {
    emoji: "🥥", imagem: "frutas",
    description: "Coco seco do Pará, próprio para leite e doces caseiros.",
  }),
  criar("acerola", "Acerola", FRUTAS, 9.0, "500 g", "ana-frutas", {
    emoji: "🍒", imagem: "frutas", disponivel: false,
    description: "Acerola rica em vitamina C, colhida e entregue no mesmo dia.",
  }),
  criar("caju", "Caju", FRUTAS, 6.0, "kg", "dona-rosa-raizes", {
    emoji: "🍎", imagem: "frutas",
    description: "Caju maduro do Maranhão, para suco, castanha e doces.",
  }),

  // ---------- PRODUTOS DE ORIGEM ANIMAL ----------
  criar("ovos-caipiras", "Ovos Caipiras", ANIMAL, 14.0, "dúzia", "clara-hortalicas", {
    emoji: "🥚", imagem: "ovos", rating: 4.9, fairTradePct: 95,
    description: "Ovos de galinhas criadas soltas na horta, com gema bem amarela.",
  }),
  criar("leite", "Leite Fresco", ANIMAL, 7.0, "litro", "seu-ze-queijo", {
    emoji: "🥛", imagem: "animal",
    description: "Leite integral do sítio, ordenhado pela manhã e refrigerado.",
  }),
  criar("queijo-artesanal", "Queijo Artesanal", ANIMAL, 32.0, "500 g", "seu-ze-queijo", {
    emoji: "🧀", imagem: "animal", rating: 4.9, fairTradePct: 96,
    description: "Queijo minas artesanal maturado, feito com leite cru da própria propriedade.",
  }),
  criar("manteiga-artesanal", "Manteiga Artesanal", ANIMAL, 24.0, "250 g", "seu-ze-queijo", {
    emoji: "🧈", imagem: "animal",
    description: "Manteiga batida no pilão, com sal marinho e sabor de fazenda.",
  }),
  criar("mel-abelha", "Mel de Abelha", "mel", 18.0, "500 g", "pedro-mel", {
    emoji: "🍯", imagem: "mel", rating: 4.8,
    description: "Mel silvestre do sertão cearense, colhido sem fumaça e sem açúcar.",
  }),

  // ---------- FARINHAS E DERIVADOS ----------
  criar("farinha-mandioca", "Farinha de Mandioca", FARINHAS, 8.5, "kg", "cleide-farinhas", {
    emoji: "🌾", imagem: "farinhas", rating: 4.9,
    description: "Farinha torrada no forno de barro, crocante e feita na hora.",
  }),
  criar("farinha-tapioca", "Farinha de Tapioca", FARINHAS, 11.0, "kg", "cleide-farinhas", {
    emoji: "🌾", imagem: "farinhas",
    description: "Farinha de tapioca fina, pronta para beijus e crepiocas.",
  }),
  criar("goma-tapioca", "Goma de Tapioca", FARINHAS, 9.5, "500 g", "cleide-farinhas", {
    emoji: "🫓", imagem: "farinhas", rating: 4.8,
    description: "Goma úmida peneirada, doce ou azeda, feita da mandioca da roça.",
  }),
  criar("polvilho", "Polvilho", FARINHAS, 8.0, "500 g", "cleide-farinhas", {
    emoji: "🌾", imagem: "farinhas",
    description: "Polvilho azedo para pão de queijo, seco lentamente ao sol.",
  }),
  criar("beiju", "Beiju", FARINHAS, 12.0, "pacote 6 un.", "cleide-farinhas", {
    emoji: "🫓", imagem: "farinhas",
    description: "Beiju artesanal assado na chapa, receita da avó da Cleide.",
  }),
  criar("rapadura", "Rapadura", FARINHAS, 10.0, "500 g", "seu-ze-queijo", {
    emoji: "🍯", imagem: "farinhas", disponivel: false,
    description: "Rapadura de engenho pequeno, sem conservantes. Lote esgotado.",
  }),
  criar("acucar-mascavo", "Açúcar Mascavo", FARINHAS, 13.0, "500 g", "cleide-farinhas", {
    emoji: "🍬", imagem: "farinhas",
    description: "Açúcar mascavo moído no engenho familiar do Cerrado goiano.",
  }),

  // ---------- PRODUTOS ARTESANAIS ----------
  criar("doces-caseiros", "Doces Caseiros", ARTESANAIS, 16.0, "pote 400 g", "maria-cacau", {
    emoji: "🍮", imagem: "artesanais",
    description: "Doces de coco, abóbora e goiabada cozidos no tacho de cobre.",
  }),
  criar("geleias", "Geleias Artesanais", ARTESANAIS, 18.0, "pote 250 g", "maria-cacau", {
    emoji: "🍓", imagem: "artesanais",
    description: "Geleia de cacau com frutas da Mata Atlântica, sem corantes.",
  }),
  criar("polpas-frutas", "Polpas de Frutas", ARTESANAIS, 9.0, "500 g", "ana-frutas", {
    emoji: "🥤", imagem: "artesanais",
    description: "Polpa congelada de acerola, goiaba e maracujá, sem água adicionada.",
  }),
  criar("biscoitos-caseiros", "Biscoitos Caseiros", ARTESANAIS, 14.0, "pacote 300 g", "cleide-farinhas", {
    emoji: "🍪", imagem: "artesanais",
    description: "Biscoitos de polvilho assados no forno à lenha da propriedade.",
  }),
  criar("paes-artesanais", "Pães Artesanais", ARTESANAIS, 15.0, "unidade 600 g", "cleide-farinhas", {
    emoji: "🍞", imagem: "artesanais", rating: 4.9,
    description: "Pão de fermentação natural com farinha da própria mandioca.",
  }),
  criar("artesanato-rural", "Artesanato Rural", ARTESANAIS, 45.0, "peça", "maria-cacau", {
    emoji: "🧺", imagem: "artesanais", fairTradePct: 90,
    description: "Cestos e trançados de palha feitos à mão pelas mulheres da comunidade.",
  }),
];