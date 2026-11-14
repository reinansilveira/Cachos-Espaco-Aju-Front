import { api } from "./api/axios";

export type ProductType = "SALE" | "INTERNAL_USE";
export type ProductUnit = "UNIT" | "ML" | "G";
export type StockMovementType =
  "IN" | "SALE" | "INTERNAL_USE" | "ADJUSTMENT" | "LOSS" | "RETURN";
export type ManualMovementType = "IN" | "INTERNAL_USE" | "LOSS" | "ADJUSTMENT";

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  type: ProductType;
  unit: ProductUnit;
  salePrice: number | null;
  costPrice: number | null;
  stockQuantity: number;
  minStock: number;
  lowStock: boolean;
  barcode: string | null;
  active: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: { id: string; name: string; type: ProductType };
  type: StockMovementType;
  quantity: number;
  balanceAfter: number;
  unitCost: number | null;
  reason: string | null;
  order: { id: string; number: number } | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  brand?: string;
  type: ProductType;
  unit?: ProductUnit;
  salePrice?: number;
  costPrice?: number;
  initialStock?: number;
  minStock?: number;
  barcode?: string;
}

export interface StockMovementInput {
  type: ManualMovementType;
  quantity: number;
  unitCost?: number;
  reason?: string;
}

export async function listProducts(
  params: {
    type?: ProductType;
    search?: string;
    lowStock?: boolean;
  } = {},
) {
  const { data } = await api.get<Product[]>("/products", { params });
  return data;
}

export async function createProduct(input: ProductInput) {
  const { data } = await api.post<Product>("/products", input);
  return data;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  // O saldo só muda por movimento: o estoque inicial nunca vai na edição.
  const body = { ...input, initialStock: undefined };
  const { data } = await api.patch<Product>(`/products/${id}`, body);
  return data;
}

export async function deactivateProduct(id: string) {
  const { data } = await api.delete<Product>(`/products/${id}`);
  return data;
}

export async function registerStockMovement(
  productId: string,
  input: StockMovementInput,
) {
  const { data } = await api.post<StockMovement>(
    `/products/${productId}/movements`,
    input,
  );
  return data;
}

export async function listStockMovements(take = 30) {
  const { data } = await api.get<StockMovement[]>("/products/movements", {
    params: { take },
  });
  return data;
}
