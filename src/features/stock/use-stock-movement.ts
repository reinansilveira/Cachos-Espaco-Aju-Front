import { useState, type FormEvent } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  registerStockMovement,
  type ManualMovementType,
  type Product,
} from "@/services/product";
import { previewBalance } from "./stock.utils";

export function useStockMovement(
  product: Product,
  onClose: (changed?: boolean) => void,
) {
  const [type, setType] = useState<ManualMovementType>("IN");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const amount = quantity.trim() ? Number(quantity) : Number.NaN;
  const balance = previewBalance(product.stockQuantity, type, amount);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!Number.isInteger(amount) || amount < 0) {
      return setError("Informe uma quantidade inteira.");
    }
    if (balance < 0) {
      return setError(`Só há ${product.stockQuantity} em estoque.`);
    }

    setSaving(true);
    try {
      await registerStockMovement(product.id, {
        type,
        quantity: amount,
        unitCost:
          type === "IN" && unitCost.trim()
            ? Number(unitCost.replace(",", "."))
            : undefined,
        reason: reason.trim() || undefined,
      });
      onClose(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível lançar o movimento."));
    } finally {
      setSaving(false);
    }
  };

  return {
    type,
    setType,
    quantity,
    setQuantity,
    unitCost,
    setUnitCost,
    reason,
    setReason,
    balance,
    submit,
    saving,
    error,
  };
}
