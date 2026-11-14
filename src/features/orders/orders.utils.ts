import type { Order, OrderStatus, PaymentMethod } from "@/services/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  OPEN: "Aberta",
  AWAITING_PAYMENT: "Aguardando pagamento",
  PAID: "Paga",
  CANCELLED: "Cancelada",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  OPEN: "open",
  AWAITING_PAYMENT: "waiting",
  PAID: "paid",
  CANCELLED: "cancelled",
};

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  CASH: "Dinheiro",
};

// Opções de pagamento da comanda, na ordem em que aparecem na tela.
export const PAYMENT_OPTIONS = [
  {
    id: "pix-asaas",
    method: "PIX",
    gateway: true,
    title: "Pix com QR Code",
    hint: "A cliente paga pelo celular e a comanda baixa sozinha.",
  },
  {
    id: "card-machine",
    method: "CREDIT_CARD",
    gateway: false,
    title: "Crédito na maquininha",
    hint: "Registre depois que a maquininha aprovar.",
  },
  {
    id: "debit-machine",
    method: "DEBIT_CARD",
    gateway: false,
    title: "Débito na maquininha",
    hint: "Registre depois que a maquininha aprovar.",
  },
  {
    id: "card-link",
    method: "CREDIT_CARD",
    gateway: true,
    title: "Link de cartão",
    hint: "Envie o link do Asaas para a cliente pagar no cartão.",
  },
  {
    id: "pix-key",
    method: "PIX",
    gateway: false,
    title: "Pix na chave do salão",
    hint: "Confirme no app do banco antes de registrar.",
  },
  {
    id: "cash",
    method: "CASH",
    gateway: false,
    title: "Dinheiro",
    hint: "Registre o valor recebido no caixa.",
  },
] as const satisfies readonly {
  id: string;
  method: PaymentMethod;
  gateway: boolean;
  title: string;
  hint: string;
}[];

export type PaymentOptionId = (typeof PAYMENT_OPTIONS)[number]["id"];

export const findPaymentOption = (id: PaymentOptionId) =>
  PAYMENT_OPTIONS.find((option) => option.id === id)!;

export const productUnits = (order: Pick<Order, "items">) =>
  order.items
    .filter((item) => item.type === "PRODUCT")
    .reduce((sum, item) => sum + item.quantity, 0);

// Cobrança do saldo em aberto (o sinal pendente é da cliente, no site).
export const pendingGatewayPayment = (order: Pick<Order, "payments">) =>
  order.payments.find(
    (payment) =>
      payment.gateway && payment.status === "PENDING" && !payment.isDeposit,
  ) ?? null;

export const paidDeposit = (order: Pick<Order, "payments">) =>
  order.payments.find(
    (payment) => payment.isDeposit && payment.status === "PAID",
  ) ?? null;

export function cpfMask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

// Comanda aberta só pelo sinal de um horário futuro ainda não é "do dia".
const isUpcoming = (order: Order, now: Date) =>
  order.status === "OPEN" &&
  !!order.appointment &&
  new Date(order.appointment.scheduledAt).toDateString() !==
    now.toDateString() &&
  new Date(order.appointment.scheduledAt) > now;

export function groupOrders(orders: Order[], now = new Date()) {
  return {
    upcoming: orders.filter((order) => isUpcoming(order, now)),
    open: orders.filter(
      (order) => order.status === "OPEN" && !isUpcoming(order, now),
    ),
    waiting: orders.filter((order) => order.status === "AWAITING_PAYMENT"),
    done: orders.filter(
      (order) => order.status === "PAID" || order.status === "CANCELLED",
    ),
  };
}

export function todayTotals(orders: Order[], now = new Date()) {
  const sameDay = (value: string | null) =>
    !!value && new Date(value).toDateString() === now.toDateString();
  const paidToday = orders.filter(
    (order) => order.status === "PAID" && sameDay(order.paidAt),
  );
  return {
    count: paidToday.length,
    revenue: paidToday.reduce((sum, order) => sum + order.total, 0),
    products: paidToday.reduce((sum, order) => sum + productUnits(order), 0),
  };
}

// Concluído o atendimento, a comanda abre já com o serviço do agendamento.
export const appointmentOrderLink = (appointmentId: string) =>
  `/dashboard?view=comandas&atendimento=${appointmentId}`;
