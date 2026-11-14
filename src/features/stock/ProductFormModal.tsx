"use client";

import { PanelDialog } from "@/components/panel-dialog/PanelDialog";
import type { Product } from "@/services/product";
import { useProductForm } from "./use-product-form";

export function ProductFormModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: (changed?: boolean) => void;
}) {
  const { form, updateField, submit, deactivate, saving, error, isEdit } =
    useProductForm(product, onClose);

  return (
    <PanelDialog
      title={isEdit ? "Editar produto" : "Novo produto"}
      eyebrow="Estoque"
      onClose={() => onClose()}
    >
      <form className="panel-form" onSubmit={submit}>
        <fieldset className="panel-form__choice">
          <legend>Para que serve?</legend>
          <label className="panel-form__option">
            <input
              type="radio"
              name="type"
              checked={form.type === "SALE"}
              onChange={() => updateField("type", "SALE")}
            />
            <span>
              <b>Venda</b>
              <small>A cliente leva para casa e entra na comanda</small>
            </span>
          </label>
          <label className="panel-form__option">
            <input
              type="radio"
              name="type"
              checked={form.type === "INTERNAL_USE"}
              onChange={() => updateField("type", "INTERNAL_USE")}
            />
            <span>
              <b>Uso interno</b>
              <small>Usado nas clientes durante o serviço</small>
            </span>
          </label>
        </fieldset>

        <label className="panel-form__field panel-form__field--wide">
          Nome
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Creme de pentear 500ml"
            required
          />
        </label>
        <label className="panel-form__field">
          Marca
          <input
            value={form.brand}
            onChange={(event) => updateField("brand", event.target.value)}
            placeholder="Opcional"
          />
        </label>
        <label className="panel-form__field">
          Contagem por
          <select
            value={form.unit}
            onChange={(event) =>
              updateField("unit", event.target.value as typeof form.unit)
            }
          >
            <option value="UNIT">Unidade</option>
            <option value="ML">Frasco</option>
            <option value="G">Pote</option>
          </select>
        </label>
        {form.type === "SALE" && (
          <label className="panel-form__field">
            Preço de venda (R$)
            <input
              inputMode="decimal"
              value={form.salePrice}
              onChange={(event) => updateField("salePrice", event.target.value)}
              placeholder="59,90"
            />
          </label>
        )}
        <label className="panel-form__field">
          Custo (R$)
          <input
            inputMode="decimal"
            value={form.costPrice}
            onChange={(event) => updateField("costPrice", event.target.value)}
            placeholder="Opcional"
          />
        </label>
        {!isEdit && (
          <label className="panel-form__field">
            Quantidade em estoque
            <input
              type="number"
              min={0}
              value={form.initialStock}
              onChange={(event) =>
                updateField("initialStock", event.target.value)
              }
              placeholder="0"
            />
          </label>
        )}
        <label className="panel-form__field">
          Avisar quando tiver
          <input
            type="number"
            min={0}
            value={form.minStock}
            onChange={(event) => updateField("minStock", event.target.value)}
          />
        </label>
        <label className="panel-form__field">
          Código de barras
          <input
            value={form.barcode}
            onChange={(event) => updateField("barcode", event.target.value)}
            placeholder="Opcional"
          />
        </label>

        {error && (
          <p className="panel-form__error" role="alert">
            {error}
          </p>
        )}

        <footer className="panel-form__footer">
          {isEdit && (
            <button
              type="button"
              className="panel-button panel-button--ghost-danger"
              onClick={deactivate}
              disabled={saving}
            >
              Remover produto
            </button>
          )}
          <button type="submit" className="panel-button" disabled={saving}>
            {saving ? "Salvando…" : isEdit ? "Salvar" : "Cadastrar produto"}
          </button>
        </footer>
      </form>
    </PanelDialog>
  );
}
