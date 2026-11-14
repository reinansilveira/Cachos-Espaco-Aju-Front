// Conteúdo real do Espaço Cachos Aju: fotos do post de inauguração do novo
// espaço no Instagram (public/salao), catálogo e combinados do Trinks e
// avaliações públicas do Google Maps.

export const PHOTOS = {
  facade: "/salao/fachada.jpg",
  facadeNight: "/salao/fachada-noite.jpg",
  greenWall: "/salao/salao-parede-verde.jpg",
  receptionChair: "/salao/salao-recepcao-cadeira.jpg",
  reception: "/salao/recepcao.jpg",
  sunset: "/salao/salao-por-do-sol.jpg",
  makeup: "/salao/estacao-make.jpg",
  mirrors: "/salao/salao-espelhos.jpg",
  washbasins: "/salao/salao-lavatorio.jpg",
  washbasinsTall: "/salao/salao-lavatorio-vertical.jpg",
  lounge: "/salao/salao-espera.jpg",
} as const;

export const VIDEOS = {
  tour: "/salao/tour.mp4",
  tourVertical: "/salao/tour-vertical.mp4",
} as const;

export const NAV = [
  { label: "Seu cacho", href: "/#seu-cacho" },
  { label: "Serviços", href: "/#servicos" },
  { label: "O espaço", href: "/#espaco" },
  { label: "Equipe", href: "/#equipe" },
  { label: "Visite", href: "/#visite" },
] as const;

// Intenções da cliente, cada uma juntando categorias do catálogo.
export const INTENTS = [
  {
    id: "cortar",
    label: "Cortar",
    title: "Design de corte",
    text: "Corte personalizado para o seu objetivo, sempre com higienização, fitagem e secagem difusora.",
    categories: ["Design de Corte", "Combos"],
    photo: PHOTOS.greenWall,
  },
  {
    id: "tratar",
    label: "Tratar",
    title: "Cronograma e tratamentos",
    text: "Hidratação, nutrição e reconstrução com Toctus e Cadiveu, do jeito que o seu fio pede.",
    categories: ["Cronograma Capilar", "Tratamentos"],
    photo: PHOTOS.receptionChair,
  },
  {
    id: "couro",
    label: "Couro cabeludo",
    title: "Terapia capilar",
    text: "Argila, óleos essenciais, detox e alta frequência para a raiz respirar.",
    categories: ["Terapia Capilar"],
    photo: PHOTOS.sunset,
  },
  {
    id: "cor",
    label: "Cor",
    title: "Mechas e cor",
    text: "Ruivo, iluminado, loiro e cobertura de brancos. Toda cor começa pela avaliação com teste de mechas.",
    categories: ["Cor"],
    photo: PHOTOS.reception,
  },
  {
    id: "finalizar",
    label: "Finalizar",
    title: "Finalização",
    text: "Lavagem, fitagem e secagem. O valor acompanha o comprimento e o volume.",
    categories: ["Finalizações"],
    photo: PHOTOS.mirrors,
  },
  {
    id: "ocasioes",
    label: "Ocasiões",
    title: "Penteado e make",
    text: "Para casamentos, formaturas e fotos, valorizando a sua textura.",
    categories: ["Penteados", "Maquiagem"],
    photo: PHOTOS.makeup,
  },
] as const;

export type IntentId = (typeof INTENTS)[number]["id"];

export const TEXTURES = [
  {
    id: "ondulado",
    label: "Ondulado",
    hint: "2A · 2B · 2C",
    tip: "Ondas pedem leveza: produto na medida certa para não pesar a raiz.",
  },
  {
    id: "cacheado",
    label: "Cacheado",
    hint: "3A · 3B · 3C",
    tip: "Cachos definidos nascem de corte a seco e água na fibra.",
  },
  {
    id: "crespo",
    label: "Crespo",
    hint: "4A · 4B · 4C",
    tip: "Crespos amam nutrição e um corte que respeita o volume.",
  },
  {
    id: "transicao",
    label: "Em transição",
    hint: "Duas texturas",
    tip: "Na transição, cuidamos das duas texturas até o big chop, se for o seu desejo.",
  },
] as const;

export type TextureId = (typeof TEXTURES)[number]["id"];

export const GOALS = [
  { id: "corte", label: "Mudar o corte" },
  { id: "saude", label: "Recuperar o fio" },
  { id: "couro", label: "Couro cabeludo" },
  { id: "cor", label: "Mudar a cor" },
  { id: "evento", label: "Tenho um evento" },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

// Nome exato do serviço no catálogo para cada combinação. A primeira opção é
// a indicação principal; a segunda, uma alternativa.
export const RECOMMENDATIONS: Record<
  GoalId,
  Partial<Record<TextureId, string[]>> & { default: string[] }
> = {
  corte: {
    default: ["Corte", "Corte + Hidronutrição"],
    crespo: ["Corte + Hidronutrição", "Corte"],
    transicao: ["Corte + Protocolo Antiporosidade", "Corte"],
  },
  saude: {
    default: ["Hidronutrição Capilar", "Protocolo HNR"],
    ondulado: ["Hidratação Capilar", "Nutri Glow"],
    crespo: ["Protocolo HNR", "Nutrição Capilar"],
    transicao: ["Protocolo Antiporosidade", "Reconstrução Capilar"],
  },
  couro: { default: ["Ritual de Argiloterapia", "Sinergia de Óleos"] },
  cor: { default: ["Avaliação e Teste de Mechas", "Banho de Luz"] },
  evento: { default: ["Penteado", "Maquiagem"] },
};

export const SPACE = [
  {
    photo: PHOTOS.reception,
    title: "A recepção",
    text: "O logo dourado e a luz ondulada, como um cacho.",
  },
  {
    photo: PHOTOS.washbasins,
    title: "A parede verde",
    text: "Lavatórios e a prateleira com tudo o que usamos em você.",
  },
  {
    photo: PHOTOS.sunset,
    title: "Fim de tarde",
    text: "Primeiro andar, com o pôr do sol do Centro na janela.",
  },
  {
    photo: PHOTOS.makeup,
    title: "A estação de make",
    text: "Luz quente e pincéis prontos para o seu dia.",
  },
] as const;

export const TEAM_EXTRA: Record<
  string,
  { instagram: string; whatsapp: string }
> = {
  Linnda: { instagram: "linndalys", whatsapp: "5579981750872" },
  Sil: { instagram: "siilvaniacosta", whatsapp: "5579998327066" },
};

export const GOOGLE = {
  rating: 5,
  count: 42,
  url: "https://www.google.com/maps/search/?api=1&query=Espa%C3%A7o+Cachos+Aju%2C+Rua+Maruim+766%2C+Aracaju",
};

export const REVIEWS = [
  {
    client: "Glicia K.",
    when: "há 1 mês",
    text: "Linnda foi muito acolhedora, amei o corte e ainda aprendi outras formas de finalização.",
  },
  {
    client: "Renata V.",
    when: "há 4 meses",
    text: "Um espaço agradável e profissionais competentes. A cada ida me surpreendo com a dedicação e qualidade do trabalho. Sil e Linda são maravilhosas. Saio renovada.",
  },
  {
    client: "Fernanda S.",
    when: "há 7 meses",
    text: "Cheguei com um cabelo sem corte, com cachos que não seguravam e saí de lá com o cabelo renovado. Também aprendi como manter e finalizar. Nota 10!",
  },
  {
    client: "Ana Júlia C.",
    when: "há 7 meses",
    text: "Amei o atendimento, a troca de conhecimento e o esclarecimento de algumas dúvidas. Além disso, o corte do cabelo ficou divino!!",
  },
  {
    client: "Vivian G.",
    when: "há 1 ano",
    text: "A Linnda Lys que me atendeu é uma ótima profissional. Ela tonalizou, cortou e fez um tratamento no meu cabelo, ele ficou perfeito.",
  },
] as const;

export const AGREEMENTS = [
  {
    q: "Preciso pagar sinal?",
    a: "Sim. O sinal é de 20% do serviço, garante o seu horário e é descontado do valor no dia. Depois de pago, não é reembolsado, mas você pode remarcar uma vez avisando com 24h.",
  },
  {
    q: "Como venho para o corte?",
    a: "Com o cabelo solto e finalizado como você costuma usar. Se estiver embaraçado além do normal (3 dias ou mais sem lavar), há uma taxa a partir de R$ 20.",
  },
  {
    q: "Quero mudar a cor. Por onde começo?",
    a: "Pela avaliação com teste de mechas (R$ 50). No dia anterior, lave e finalize o cabelo sem gelatina nem óleos. Retoque de raiz é direto para quem já faz com a gente.",
  },
  {
    q: "Posso levar acompanhante?",
    a: "Nosso espaço é pequeno e aconchegante, então pedimos que venha sozinha. Gestantes, bebês de colo, PCD e pessoas acima de 60 podem vir acompanhadas; menores de 18 precisam de um responsável.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Separe 1h30 para corte ou tratamento e de 2h a 2h30 para combos de corte com tratamento.",
  },
] as const;

export const VISIT = {
  street: "Rua Maruim, 766 · sala 6, 1º andar",
  note: "Toque o interfone 6",
  district: "Centro · Aracaju/SE · 49010-160",
  hours: [
    { label: "Terça a sexta", time: "9h às 18h" },
    { label: "Sábado", time: "8h às 18h" },
    { label: "Domingo e segunda", time: "Fechado" },
  ],
  perks: ["Wi-Fi", "Estacionamento grátis", "Acessível", "Adultos e crianças"],
  payments: "Pix, cartões de crédito e débito, dinheiro e link de pagamento",
  mapEmbed:
    "https://www.google.com/maps?q=Espa%C3%A7o+Cachos+Aju,+Rua+Maruim+766,+Aracaju&output=embed",
} as const;

// Expediente para o "aberto agora" (dia da semana: 0 = domingo).
export const OPENING = [
  null,
  null,
  { open: 9, close: 18 },
  { open: 9, close: 18 },
  { open: 9, close: 18 },
  { open: 9, close: 18 },
  { open: 8, close: 18 },
] as const;

export const INSTAGRAM = "espacocachosaju";
export const WHATSAPP = "5579981750872";
