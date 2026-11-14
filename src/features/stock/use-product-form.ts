import { useState, type FormEvent } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  createProduct,
  deactivateProduct,
  updateProduct,
  type Product,
  type ProductType,
  type ProductUnit,
} from "@/services/product";

type ProductForm = {
  name: string;
  brand: string;
  type: ProductType;
  unit: ProductUnit;
  salePrice: string;
  costPrice: string;
  initialStock: string;
  minStock: string;
  barcode: string;
};

const toForm = (product: Product | null): ProductForm => ({
  name: product?.name ?? "",
  brand: product?.brand ?? "",
  type: product?.type ?? "SALE",
  unit: product?.unit ?? "UNIT",
  salePrice: product?.salePrice?.toString() ?? "",
  costPrice: product?.costPrice?.toString() ?? "",
  initialStock: "",
  minStock: product?.minStock.toString() ?? "2",
  barcode: product?.barcode ?? "",
});

const money = (value: string) =>
  value.trim() ? Number(value.replace(",", ".")) : undefined;
const integer = (value: string) => (value.trim() ? Number(value) : undefined);

export function useProductForm(
  product: Product | null,
  onClose: (changed?: boolean) => void,
) {
  const [form, setForm] = useState<ProductForm>(() => toForm(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Dê um nome ao produto.");
    if (form.type === "SALE" && money(form.salePrice) === undefined) {
      return setError("Produto de venda precisa de preço.");
    }

    const input = {
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      type: form.type,
      unit: form.unit,
      salePrice: form.type === "SALE" ? money(form.salePrice) : undefined,
      costPrice: money(form.costPrice),
      minStock: integer(form.minStock),
      barcode: form.barcode.trim() || undefined,
    };

    setSaving(true);
    try {
      if (product) await updateProduct(product.id, input);
      else
        await createProduct({
          ...input,
          initialStock: integer(form.initialStock),
        });
      onClose(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível salvar o produto."));
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    if (!product) return;
    setSaving(true);
    try {
      await deactivateProduct(product.id);
      onClose(true);
    } catch (err) {
      setError(
        apiErrorMessage(err, "Só a administradora pode remover produtos."),
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    updateField,
    submit,
    deactivate,
    saving,
    error,
    isEdit: !!product,
  };
}
