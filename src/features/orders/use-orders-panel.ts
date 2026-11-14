import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiErrorMessage } from "@/services/api/api-error";
import { createOrder, listOrders, type Order } from "@/services/order";
import { groupOrders, todayTotals } from "./orders.utils";

export function useOrdersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const selectedId = params.get("comanda");
  const appointmentId = params.get("atendimento");
  const handledAppointment = useRef<string | null>(null);

  const setSelected = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(params.toString());
      next.delete("atendimento");
      if (id) next.set("comanda", id);
      else next.delete("comanda");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const load = useCallback(async () => {
    setError("");
    try {
      setOrders(await listOrders({ search: search.trim() || undefined }));
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível carregar as comandas."));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  // Vindo da agenda (?atendimento=), abre a comanda do atendimento ou cria.
  useEffect(() => {
    if (!appointmentId || handledAppointment.current === appointmentId) return;
    handledAppointment.current = appointmentId;
    void (async () => {
      try {
        const [existing] = await listOrders({ appointmentId });
        const order = existing ?? (await createOrder({ appointmentId }));
        setSelected(order.id);
        void load();
      } catch (err) {
        setError(
          apiErrorMessage(
            err,
            "Não foi possível abrir a comanda do atendimento.",
          ),
        );
      }
    })();
  }, [appointmentId, load, setSelected]);

  const newOrder = async () => {
    setCreating(true);
    setError("");
    try {
      const order = await createOrder({});
      setSelected(order.id);
      void load();
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível abrir a comanda."));
    } finally {
      setCreating(false);
    }
  };

  const groups = useMemo(() => groupOrders(orders), [orders]);
  const today = useMemo(() => todayTotals(orders), [orders]);

  return {
    groups,
    today,
    search,
    setSearch,
    loading,
    error,
    creating,
    newOrder,
    selectedId,
    open: (id: string) => setSelected(id),
    closeDetail: () => {
      setSelected(null);
      void load();
    },
    reload: load,
  };
}
