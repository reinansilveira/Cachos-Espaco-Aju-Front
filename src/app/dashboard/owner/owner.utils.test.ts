import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeAppointment, makePayment } from "@/test/factories";
import {
  buildDashboardOverviewStats,
  orderToPayment,
  resolveTitle,
} from "./owner.utils";

describe("buildDashboardOverviewStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-01T15:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calcula os indicadores do dia e a satisfação", () => {
    const stats = buildDashboardOverviewStats(
      [
        makeAppointment({ scheduledAt: "2026-11-01T13:00:00.000Z" }),
        makeAppointment({
          id: "a2",
          status: "COMPLETED",
          scheduledAt: "2026-11-01T14:00:00.000Z",
          client: { id: "client-2", name: "João" },
        }),
        makeAppointment({
          id: "returning",
          scheduledAt: "2026-11-01T16:00:00.000Z",
          client: { id: "client-3", name: "Ana" },
        }),
        makeAppointment({
          id: "first-visit",
          scheduledAt: "2026-10-01T16:00:00.000Z",
          client: { id: "client-3", name: "Ana" },
        }),
        makeAppointment({
          id: "cancelled",
          status: "CANCELLED",
          scheduledAt: "2026-11-01T17:00:00.000Z",
        }),
      ],
      [
        makePayment({ finalAmount: 40 }),
        makePayment({ id: "old", paidAt: "2026-10-01T12:00:00.000Z" }),
      ],
      [
        { id: "r1", rating: 5, active: true },
        { id: "r2", rating: 4, active: true },
        { id: "r3", rating: 1, active: false },
      ],
    );

    expect(stats).toMatchObject({
      todayEarnings: 40,
      todayAppointments: 3,
      completedToday: 1,
      newClientsToday: 2,
      satisfaction: 90,
      reviewCount: 2,
    });
    expect(stats.ratingDistribution.map((item) => item.count)).toEqual([
      0, 0, 0, 1, 1,
    ]);
  });

  it("não inventa satisfação quando não há avaliações", () => {
    expect(buildDashboardOverviewStats([], [], []).satisfaction).toBeNull();
  });
});

describe("resolveTitle", () => {
  it("usa o rótulo do menu para cada visão", () => {
    expect(resolveTitle("dashboard")).toBe("Painel");
    expect(resolveTitle("agenda")).toBe("Agenda");
    expect(resolveTitle("comandas")).toBe("Comandas");
    expect(resolveTitle("estoque")).toBe("Estoque");
    expect(resolveTitle("profissionais")).toBe("Equipe");
  });
});

describe("orderToPayment", () => {
  const order = {
    id: "o1",
    number: 3,
    status: "PAID" as const,
    subtotal: 210,
    discount: 10,
    total: 200,
    paidAmount: 200,
    dueAmount: 0,
    notes: null,
    client: { id: "c1", name: "Maria", phone: null, hasCpf: true },
    appointment: null,
    openedBy: null,
    items: [
      {
        id: "i1",
        type: "SERVICE" as const,
        serviceId: "s1",
        productId: null,
        description: "Corte de cachos",
        quantity: 1,
        unitPrice: 150,
        total: 150,
        professional: { id: "p1", name: "Ana" },
        availableStock: null,
      },
    ],
    payments: [
      {
        id: "pay1",
        method: "PIX" as const,
        gateway: true,
        status: "PAID" as const,
        amount: 200,
        invoiceUrl: null,
        pixPayload: null,
        paidAt: "2026-11-13T15:00:00Z",
        createdAt: "2026-11-13T14:00:00Z",
      },
    ],
    closedAt: null,
    paidAt: "2026-11-13T15:00:00Z",
    cancelledAt: null,
    createdAt: "2026-11-13T14:00:00Z",
  };

  it("usa o total da comanda, a forma paga e quem atendeu", () => {
    expect(orderToPayment(order)).toMatchObject({
      finalAmount: 200,
      paidAt: "2026-11-13T15:00:00Z",
      status: "PAID",
      method: "PIX",
      appointment: {
        service: { name: "Corte de cachos" },
        professional: { name: "Ana" },
        client: { name: "Maria" },
      },
    });
  });

  it("comanda só de produtos aparece como venda do salão", () => {
    const payment = orderToPayment({ ...order, items: [], client: null });
    expect(payment.appointment?.service?.name).toBe("Venda de produtos");
    expect(payment.appointment?.professional?.name).toBe("Salão");
    expect(payment.appointment?.client?.name).toBe("Cliente avulsa");
  });
});
