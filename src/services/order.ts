import { api } from "./api/axios";

export type OrderStatus = "OPEN" | "AWAITING_PAYMENT" | "PAID" | "CANCELLED";
export type PaymentMethod = "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX";
export type OrderPaymentStatus =
  "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface OrderItem {
  id: string;
  type: "SERVICE" | "PRODUCT";
  serviceId: string | null;
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  professional: { id: string; name: string } | null;
  availableStock: number | null;
}

export interface OrderPayment {
  id: string;
  method: PaymentMethod;
  gateway: boolean;
  // Sinal pago pela cliente no agendamento online.
  isDeposit?: boolean;
  status: OrderPaymentStatus;
  amount: number;
  invoiceUrl: string | null;
  pixPayload: string | null;
  pixQrCodeImage?: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  number: number;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  // Já pago (sinal incluído) e o que falta receber.
  paidAmount: number;
  dueAmount: number;
  notes: string | null;
  client: {
    id: string;
    name: string;
    phone: string | null;
    hasCpf: boolean;
  } | null;
  appointment: {
    id: string;
    scheduledAt: string;
    serviceName: string;
  } | null;
  openedBy: { id: string; name: string } | null;
  items: OrderItem[];
  payments: OrderPayment[];
  closedAt: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface OrderClientOption {
  id: string;
  name: string;
  phone: string | null;
  hasCpf: boolean;
}

export interface CreatePaymentInput {
  method: PaymentMethod;
  gateway?: boolean;
  cpfCnpj?: string;
}

export async function listOrders(
  params: {
    status?: OrderStatus;
    search?: string;
    appointmentId?: string;
  } = {},
) {
  const { data } = await api.get<Order[]>("/orders", { params });
  return data;
}

export async function getOrder(id: string) {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}

export async function createOrder(input: {
  appointmentId?: string;
  clientId?: string;
}) {
  const { data } = await api.post<Order>("/orders", input);
  return data;
}

export async function updateOrder(
  id: string,
  input: { discount?: number; clientId?: string; notes?: string },
) {
  const { data } = await api.patch<Order>(`/orders/${id}`, input);
  return data;
}

export async function addOrderItem(
  id: string,
  input: {
    type: "SERVICE" | "PRODUCT";
    productId?: string;
    serviceId?: string;
    quantity?: number;
  },
) {
  const { data } = await api.post<Order>(`/orders/${id}/items`, input);
  return data;
}

export async function updateOrderItem(
  id: string,
  itemId: string,
  quantity: number,
) {
  const { data } = await api.patch<Order>(`/orders/${id}/items/${itemId}`, {
    quantity,
  });
  return data;
}

export async function removeOrderItem(id: string, itemId: string) {
  const { data } = await api.delete<Order>(`/orders/${id}/items/${itemId}`);
  return data;
}

export async function closeOrder(id: string) {
  const { data } = await api.post<Order>(`/orders/${id}/close`);
  return data;
}

export async function reopenOrder(id: string) {
  const { data } = await api.post<Order>(`/orders/${id}/reopen`);
  return data;
}

export async function cancelOrder(id: string, reason?: string) {
  const { data } = await api.post<Order>(`/orders/${id}/cancel`, { reason });
  return data;
}

export async function createOrderPayment(
  id: string,
  input: CreatePaymentInput,
) {
  const { data } = await api.post<OrderPayment>(
    `/orders/${id}/payments`,
    input,
  );
  return data;
}

export async function getOrderPix(id: string, paymentId: string) {
  const { data } = await api.get<OrderPayment>(
    `/orders/${id}/payments/${paymentId}/pix`,
  );
  return data;
}

export async function refreshOrderPayment(id: string, paymentId: string) {
  const { data } = await api.post<OrderPayment>(
    `/orders/${id}/payments/${paymentId}/refresh`,
  );
  return data;
}

export async function searchOrderClients(search: string) {
  const { data } = await api.get<OrderClientOption[]>("/orders/clients", {
    params: { search },
  });
  return data;
}
