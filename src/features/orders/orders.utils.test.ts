import { describe, expect, it } from "vitest";
import type { Order } from "@/services/order";
import {
  cpfMask,
  groupOrders,
  pendingGatewayPayment,
  productUnits,
  todayTotals,
} from "./orders.utils";

const order = (overrides: Partial<Order>): Order => ({
  id: "o",
  number: 1,
  status: "OPEN",
  subtotal: 0,
  discount: 0,
  total: 0,
  paidAmount: 0,
  dueAmount: 0,
  notes: null,
  client: null,
  appointment: null,
  openedBy: null,
  items: [],
  payments: [],
  closedAt: null,
  paidAt: null,
  cancelledAt: null,
  createdAt: "2026-11-13T12:00:00Z",
  ...overrides,
});

const item = (type: "SERVICE" | "PRODUCT", quantity: number) => ({
  id: `${type}-${quantity}`,
  type,
  serviceId: null,
  productId: null,
  description: "",
  quantity,
  unitPrice: 10,
  total: quantity * 10,
  professional: null,
  availableStock: null,
});

describe("orders utils", () => {
  it("conta só as unidades de produto", () => {
    expect(
      productUnits(order({ items: [item("SERVICE", 1), item("PRODUCT", 3)] })),
    ).toBe(3);
  });

  it("deixa de fora das abertas a comanda de sinal de horário futuro", () => {
    const now = new Date("2026-11-13T15:00:00");
    const appointment = (scheduledAt: string) => ({
      id: "a",
      scheduledAt,
      serviceName: "Corte",
    });
    const groups = groupOrders(
      [
        order({ id: "hoje", appointment: appointment("2026-11-13T17:00:00") }),
        order({
          id: "futura",
          appointment: appointment("2026-11-20T10:00:00"),
        }),
      ],
      now,
    );
    expect(groups.open.map((o) => o.id)).toEqual(["hoje"]);
    expect(groups.upcoming.map((o) => o.id)).toEqual(["futura"]);
  });

  it("separa abertas, aguardando e finalizadas", () => {
    const groups = groupOrders([
      order({ id: "a" }),
      order({ id: "b", status: "AWAITING_PAYMENT" }),
      order({ id: "c", status: "PAID" }),
      order({ id: "d", status: "CANCELLED" }),
    ]);
    expect(groups.open.map((o) => o.id)).toEqual(["a"]);
    expect(groups.waiting.map((o) => o.id)).toEqual(["b"]);
    expect(groups.done.map((o) => o.id)).toEqual(["c", "d"]);
  });

  it("soma o que foi pago hoje", () => {
    const now = new Date("2026-11-13T15:00:00");
    const totals = todayTotals(
      [
        order({
          status: "PAID",
          total: 210,
          paidAt: "2026-11-13T14:00:00",
          items: [item("PRODUCT", 3)],
        }),
        order({ status: "PAID", total: 99, paidAt: "2026-11-12T14:00:00" }),
        order({ status: "AWAITING_PAYMENT", total: 50 }),
      ],
      now,
    );
    expect(totals).toEqual({ count: 1, revenue: 210, products: 3 });
  });

  it("acha a cobrança pendente do Asaas", () => {
    const pending = {
      id: "p2",
      method: "PIX" as const,
      gateway: true,
      status: "PENDING" as const,
      amount: 10,
      invoiceUrl: null,
      pixPayload: "x",
      paidAt: null,
      createdAt: "",
    };
    expect(pendingGatewayPayment(order({ payments: [pending] }))?.id).toBe(
      "p2",
    );
    expect(
      pendingGatewayPayment(
        order({ payments: [{ ...pending, gateway: false }] }),
      ),
    ).toBeNull();
  });

  it("formata CPF", () => {
    expect(cpfMask("52998224725")).toBe("529.982.247-25");
    expect(cpfMask("5299")).toBe("529.9");
  });
});
