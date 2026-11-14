// Rótulo e tom visual de cada status de agendamento da API.
const STATUS: Record<string, { label: string; tone: string }> = {
  PENDING: { label: "Pendente", tone: "pending" },
  CONFIRMED: { label: "Confirmado", tone: "confirmed" },
  IN_PROGRESS: { label: "Em atendimento", tone: "confirmed" },
  COMPLETED: { label: "Concluído", tone: "completed" },
  CANCELLED: { label: "Cancelado", tone: "cancelled" },
  NO_SHOW: { label: "Faltou", tone: "no-show" },
};

export function appointmentStatus(status: string) {
  return STATUS[status.toUpperCase()] ?? STATUS.PENDING;
}

// Posição do atendimento no dia pelo relógio, não pela ordem na lista.
export function scheduleState(
  appointment: { scheduledAt: string; duration: number; status: string },
  now = new Date(),
): "done" | "now" | "upcoming" {
  const start = new Date(appointment.scheduledAt).getTime();
  const end = start + appointment.duration * 60_000;
  const status = appointment.status.toUpperCase();
  if (["COMPLETED", "CANCELLED", "NO_SHOW"].includes(status)) return "done";
  if (status === "IN_PROGRESS") return "now";
  if (end <= now.getTime()) return "done";
  if (start <= now.getTime()) return "now";
  return "upcoming";
}
