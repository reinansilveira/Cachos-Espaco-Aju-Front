import type {
  ManualMovementType,
  Product,
  ProductUnit,
  StockMovementType,
} from "@/services/product";

export const PRODUCT_TYPE_LABELS = {
  SALE: "Venda",
  INTERNAL_USE: "Uso interno",
} as const;

export const MOVEMENT_LABELS: Record<StockMovementType, string> = {
  IN: "Entrada",
  SALE: "Venda",
  INTERNAL_USE: "Uso no salão",
  ADJUSTMENT: "Ajuste",
  LOSS: "Perda",
  RETURN: "Devolução",
};

export const MANUAL_MOVEMENTS: {
  type: ManualMovementType;
  label: string;
  hint: string;
}[] = [
  { type: "IN", label: "Entrada", hint: "Chegou mercadoria" },
  { type: "INTERNAL_USE", label: "Uso no salão", hint: "Usado nas clientes" },
  { type: "LOSS", label: "Perda", hint: "Venceu, quebrou ou sumiu" },
  {
    type: "ADJUSTMENT",
    label: "Contagem",
    hint: "Corrigir pelo que tem na prateleira",
  },
];

const UNIT_SUFFIX: Record<ProductUnit, [string, string]> = {
  UNIT: ["unidade", "unidades"],
  ML: ["frasco", "frascos"],
  G: ["pote", "potes"],
};

export function quantityText(quantity: number, unit: ProductUnit = "UNIT") {
  const [one, many] = UNIT_SUFFIX[unit];
  return `${quantity} ${Math.abs(quantity) === 1 ? one : many}`;
}

export type StockFilter = "all" | "SALE" | "INTERNAL_USE" | "low";

export function filterProducts(
  products: Product[],
  filter: StockFilter,
  search = "",
) {
  const term = normalize(search);
  return products.filter((product) => {
    if (filter === "low" && !product.lowStock) return false;
    if (
      (filter === "SALE" || filter === "INTERNAL_USE") &&
      product.type !== filter
    ) {
      return false;
    }
    if (!term) return true;
    return normalize(`${product.name} ${product.brand ?? ""}`).includes(term);
  });
}

export function stockSummary(products: Product[]) {
  return {
    total: products.length,
    sale: products.filter((product) => product.type === "SALE").length,
    internal: products.filter((product) => product.type === "INTERNAL_USE")
      .length,
    low: products.filter((product) => product.lowStock).length,
    // Valor de venda do que está na prateleira, só produtos de venda.
    shelfValue: products.reduce(
      (sum, product) =>
        product.type === "SALE" && product.salePrice !== null
          ? sum + product.salePrice * product.stockQuantity
          : sum,
      0,
    ),
  };
}

// Prévia do saldo antes de confirmar o movimento.
export function previewBalance(
  current: number,
  type: ManualMovementType,
  quantity: number,
) {
  if (!Number.isFinite(quantity) || quantity < 0) return current;
  switch (type) {
    case "IN":
      return current + quantity;
    case "ADJUSTMENT":
      return quantity;
    default:
      return current - quantity;
  }
}

const normalize = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
