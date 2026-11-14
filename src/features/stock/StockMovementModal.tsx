"use client";

import { PanelDialog } from "@/components/panel-dialog/PanelDialog";
import type { Product } from "@/services/product";
import { cn } from "@/utils/class-names";
import { MANUAL_MOVEMENTS, quantityText } from "./stock.utils";
import { useStockMovement } from "./use-stock-movement";

export function StockMovementModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: (changed?: boolean) => void;
}) {
  const movement = useStockMovement(product, onClose);
  const isAdjustment = movement.type === "ADJUSTMENT";

  return (
    <PanelDialog
      title={product.name}
      eyebrow="Movimentar estoque"
      onClose={() => onClose()}
    >
      <form className="panel-form" onSubmit={movement.submit}>
        <div
          className="movement-types panel-form__field--wide"
          role="radiogroup"
          aria-label="Tipo de movimento"
        >
          {MANUAL_MOVEMENTS.map(({ type, label, hint }) => (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={movement.type === type}
              className={cn(
                "movement-types__option",
                movement.type === type && "movement-types__option--selected",
              )}
              onClick={() => movement.setType(type)}
            >
              <b>{label}</b>
              <small>{hint}</small>
            </button>
          ))}
        </div>

        <label className="panel-form__field">
          {isAdjustment ? "Quantas tem na prateleira?" : "Quantidade"}
          <input
            type="number"
            min={0}
            value={movement.quantity}
            onChange={(event) => movement.setQuantity(event.target.value)}
            autoFocus
            required
          />
        </label>
        {movement.type === "IN" && (
          <label className="panel-form__field">
            Custo de cada (R$)
            <input
              inputMode="decimal"
              value={movement.unitCost}
              onChange={(event) => movement.setUnitCost(event.target.value)}
              placeholder="Opcional"
            />
          </label>
        )}
        <label className="panel-form__field panel-form__field--wide">
          Observação
          <input
            value={movement.reason}
            onChange={(event) => movement.setReason(event.target.value)}
            placeholder={
              movement.type === "INTERNAL_USE"
                ? "Ex.: hidratação da Maria"
                : "Opcional"
            }
          />
        </label>

        <p className="movement-preview panel-form__field--wide">
          Hoje: <b>{quantityText(product.stockQuantity, product.unit)}</b>
          <span aria-hidden="true">→</span>
          Depois:{" "}
          <b
            className={cn(movement.balance < 0 && "movement-preview__negative")}
          >
            {quantityText(movement.balance, product.unit)}
          </b>
        </p>

        {movement.error && (
          <p className="panel-form__error" role="alert">
            {movement.error}
          </p>
        )}

        <footer className="panel-form__footer">
          <button
            type="submit"
            className="panel-button"
            disabled={movement.saving}
          >
            {movement.saving ? "Lançando…" : "Confirmar"}
          </button>
        </footer>
      </form>
    </PanelDialog>
  );
}
