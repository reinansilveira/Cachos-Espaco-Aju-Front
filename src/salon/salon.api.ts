import { publicApi } from "@/services/api/axios";
import { createPublicAppointment } from "@/services/appointment";
import { findAvailableSlots } from "@/services/slot";
import type { Slot } from "./salon.types";

// Chamadas do agendamento no navegador (passam pelo proxy da API).

export async function fetchSlots(
  professionalId: string,
  date: string,
  serviceId: string,
) {
  const slots = await findAvailableSlots(professionalId, date, serviceId);
  const now = Date.now();
  return slots.filter(
    (slot) => new Date(slot.startsAt).getTime() > now,
  ) as Slot[];
}

// Rota do próprio Next que olha vários dias de uma vez.
export async function fetchOpenDates(
  professionalId: string,
  start: string,
  days: number,
) {
  const query = new URLSearchParams({
    professionalId,
    start,
    days: String(days),
  });
  const response = await fetch(`/api/availability?${query}`);
  if (!response.ok) return null;
  const data = (await response.json()) as { availableDates: string[] };
  return new Set(data.availableDates);
}

export function book(input: {
  name: string;
  phone: string;
  email: string;
  professionalId: string;
  serviceId: string;
  slotId: string;
}) {
  return createPublicAppointment({
    ...input,
    name: input.name.trim(),
    phone: input.phone.replace(/\D/g, ""),
    email: input.email.trim(),
  });
}

export type DepositPayment = {
  id: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";
  amount: number;
  invoiceUrl?: string | null;
  pixPayload?: string | null;
  pixQrCodeImage?: string | null;
};

export async function startDeposit(
  appointmentId: string,
  input: { cpfCnpj: string; method: "PIX" | "CREDIT_CARD" },
) {
  const { data } = await publicApi.post<DepositPayment>(
    `/appointments/${appointmentId}/deposit`,
    input,
  );
  return data;
}

export async function depositStatus(appointmentId: string, paymentId: string) {
  const { data } = await publicApi.get<DepositPayment>(
    `/appointments/${appointmentId}/deposit/${paymentId}`,
  );
  return data;
}
