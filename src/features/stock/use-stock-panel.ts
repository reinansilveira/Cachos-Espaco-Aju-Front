import { useEffect, useMemo, useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  listProducts,
  listStockMovements,
  type Product,
  type StockMovement,
} from "@/services/product";
import { filterProducts, stockSummary, type StockFilter } from "./stock.utils";

type StockModal =
  | { kind: "product"; product: Product | null }
  | { kind: "movement"; product: Product }
  | null;

export function useStockPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [filter, setFilter] = useState<StockFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<StockModal>(null);

  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let current = true;
    Promise.all([listProducts(), listStockMovements(12)])
      .then(([nextProducts, nextMovements]) => {
        if (!current) return;
        setProducts(nextProducts);
        setMovements(nextMovements);
        setError("");
      })
      .catch((err) => {
        if (current) {
          setError(
            apiErrorMessage(err, "Não foi possível carregar o estoque."),
          );
        }
      })
      .finally(() => current && setLoading(false));
    return () => {
      current = false;
    };
  }, [requestId]);

  const visible = useMemo(
    () => filterProducts(products, filter, search),
    [products, filter, search],
  );
  const summary = useMemo(() => stockSummary(products), [products]);

  const closeModal = (changed?: boolean) => {
    setModal(null);
    if (changed) setRequestId((id) => id + 1);
  };

  return {
    products: visible,
    movements,
    summary,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    modal,
    openNewProduct: () => setModal({ kind: "product", product: null }),
    openEditProduct: (product: Product) =>
      setModal({ kind: "product", product }),
    openMovement: (product: Product) => setModal({ kind: "movement", product }),
    closeModal,
  };
}
