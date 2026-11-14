import { describe, expect, it } from "vitest";
import type { Product } from "@/services/product";
import {
  filterProducts,
  previewBalance,
  quantityText,
  stockSummary,
} from "./stock.utils";

const product = (overrides: Partial<Product>): Product => ({
  id: "p",
  name: "Creme",
  brand: null,
  description: null,
  type: "SALE",
  unit: "UNIT",
  salePrice: 50,
  costPrice: 20,
  stockQuantity: 5,
  minStock: 2,
  lowStock: false,
  barcode: null,
  active: true,
  ...overrides,
});

describe("stock utils", () => {
  const products = [
    product({ id: "a", name: "Creme de Pentear", brand: "Lola" }),
    product({
      id: "b",
      name: "Máscara",
      type: "INTERNAL_USE",
      salePrice: null,
      lowStock: true,
    }),
    product({ id: "c", name: "Óleo", stockQuantity: 1, lowStock: true }),
  ];

  it("filtra por tipo, estoque baixo e busca sem acento", () => {
    expect(filterProducts(products, "SALE").map((p) => p.id)).toEqual([
      "a",
      "c",
    ]);
    expect(filterProducts(products, "INTERNAL_USE").map((p) => p.id)).toEqual([
      "b",
    ]);
    expect(filterProducts(products, "low").map((p) => p.id)).toEqual([
      "b",
      "c",
    ]);
    expect(filterProducts(products, "all", "mascara").map((p) => p.id)).toEqual(
      ["b"],
    );
    expect(filterProducts(products, "all", "lola").map((p) => p.id)).toEqual([
      "a",
    ]);
  });

  it("resume o estoque e soma o valor de prateleira só dos produtos de venda", () => {
    expect(stockSummary(products)).toEqual({
      total: 3,
      sale: 2,
      internal: 1,
      low: 2,
      shelfValue: 300,
    });
  });

  it("prevê o saldo de cada tipo de movimento", () => {
    expect(previewBalance(5, "IN", 3)).toBe(8);
    expect(previewBalance(5, "INTERNAL_USE", 2)).toBe(3);
    expect(previewBalance(5, "LOSS", 1)).toBe(4);
    expect(previewBalance(5, "ADJUSTMENT", 9)).toBe(9);
    expect(previewBalance(5, "IN", Number.NaN)).toBe(5);
  });

  it("escreve a quantidade com a unidade", () => {
    expect(quantityText(1)).toBe("1 unidade");
    expect(quantityText(3, "ML")).toBe("3 frascos");
  });
});
