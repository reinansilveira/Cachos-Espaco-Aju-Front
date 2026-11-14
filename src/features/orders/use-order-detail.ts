import { useEffect, useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  addOrderItem,
  cancelOrder,
  closeOrder,
  getOrder,
  removeOrderItem,
  reopenOrder,
  searchOrderClients,
  updateOrder,
  updateOrderItem,
  type Order,
  type OrderClientOption,
} from "@/services/order";
import { listProducts, type Product } from "@/services/product";
import { findServices, type Service } from "@/services/service";

export function useOrderDetail(orderId: string, onChanged: () => void) {
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [clientOptions, setClientOptions] = useState<OrderClientOption[]>([]);
  const [discount, setDiscount] = useState("");
  const [paying, setPaying] = useState(false);

  const [productsVersion, setProductsVersion] = useState(0);
  const refreshProducts = () => setProductsVersion((version) => version + 1);

  useEffect(() => {
    getOrder(orderId)
      .then((loaded) => {
        setOrder(loaded);
        setDiscount(loaded.discount ? String(loaded.discount) : "");
      })
      .catch((err) =>
        setError(apiErrorMessage(err, "Não foi possível abrir a comanda.")),
      );
    findServices()
      .then((list) => setServices(list.filter((service) => service.active)))
      .catch(() => setServices([]));
  }, [orderId]);

  // O saldo muda ao fechar, reabrir ou cancelar: a lista é recarregada.
  useEffect(() => {
    listProducts({ type: "SALE" })
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [productsVersion]);

  const clientTerm = clientQuery.trim();
  useEffect(() => {
    if (clientTerm.length < 2) return;
    const timer = setTimeout(() => {
      void searchOrderClients(clientTerm)
        .then(setClientOptions)
        .catch(() => setClientOptions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [clientTerm]);

  // Toda ação devolve a comanda atualizada; o estoque mostrado também muda.
  const run = async (action: () => Promise<Order>, fallback: string) => {
    setBusy(true);
    setError("");
    try {
      const updated = await action();
      setOrder(updated);
      onChanged();
      return updated;
    } catch (err) {
      setError(apiErrorMessage(err, fallback));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.brand ?? ""}`
      .toLowerCase()
      .includes(productQuery.trim().toLowerCase()),
  );

  return {
    order,
    error,
    busy,
    products: visibleProducts,
    services,
    productQuery,
    setProductQuery,
    clientQuery,
    setClientQuery,
    clientOptions: clientTerm.length < 2 ? [] : clientOptions,
    discount,
    setDiscount,
    paying,
    openPayment: () => setPaying(true),
    closePayment: async (paid?: boolean) => {
      setPaying(false);
      if (paid) {
        setOrder(await getOrder(orderId));
        onChanged();
      }
    },
    addProduct: (productId: string) =>
      run(
        () =>
          addOrderItem(orderId, { type: "PRODUCT", productId, quantity: 1 }),
        "Não foi possível adicionar o produto.",
      ),
    addService: (serviceId: string) =>
      serviceId &&
      run(
        () => addOrderItem(orderId, { type: "SERVICE", serviceId }),
        "Não foi possível adicionar o serviço.",
      ),
    changeQuantity: (itemId: string, quantity: number) =>
      quantity < 1
        ? run(
            () => removeOrderItem(orderId, itemId),
            "Não foi possível remover o item.",
          )
        : run(
            () => updateOrderItem(orderId, itemId, quantity),
            "Não foi possível mudar a quantidade.",
          ),
    removeItem: (itemId: string) =>
      run(
        () => removeOrderItem(orderId, itemId),
        "Não foi possível remover o item.",
      ),
    applyDiscount: () =>
      run(
        () =>
          updateOrder(orderId, {
            discount: discount.trim() ? Number(discount.replace(",", ".")) : 0,
          }),
        "Não foi possível aplicar o desconto.",
      ),
    chooseClient: async (client: OrderClientOption) => {
      setClientQuery("");
      await run(
        () => updateOrder(orderId, { clientId: client.id }),
        "Não foi possível escolher a cliente.",
      );
    },
    close: async () => {
      const closed = await run(
        () => closeOrder(orderId),
        "Não foi possível fechar a comanda.",
      );
      refreshProducts();
      if (closed?.status === "AWAITING_PAYMENT") setPaying(true);
    },
    reopen: async () => {
      await run(
        () => reopenOrder(orderId),
        "Não foi possível reabrir a comanda.",
      );
      refreshProducts();
    },
    cancel: async () => {
      await run(
        () => cancelOrder(orderId),
        "Não foi possível cancelar a comanda.",
      );
      refreshProducts();
    },
  };
}
