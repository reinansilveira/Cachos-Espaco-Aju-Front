export const ownerNav = [
  ["Painel", "/dashboard"],
  ["Agenda", "/dashboard?view=agenda"],
  ["Comandas", "/dashboard?view=comandas"],
  ["Estoque", "/dashboard?view=estoque"],
  ["Equipe", "/dashboard?view=profissionais"],
  ["Serviços", "/dashboard?view=catalogo"],
  ["Financeiro", "/dashboard?view=metricas"],
  ["Configurações", "/dashboard?view=configuracoes"],
  ["Profissionais", "/dashboard?view=profissionais"],
  ["Novo serviço", "/dashboard?view=novo-servico"],
] as const;

// Itens que aparecem no menu lateral; os demais só dão título às telas.
export const OWNER_SIDEBAR_ITEMS = 8;
