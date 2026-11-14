import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus } from "@/services/appointment";
import { appointmentOrderLink } from "@/features/orders/orders.utils";

const FINAL_STATUSES = new Set(["COMPLETED", "CANCELLED"]);
const MIN_PERSISTED_ID_LENGTH = 20;

export const canCompleteAppointment = (id: string, status: string) =>
  id.length >= MIN_PERSISTED_ID_LENGTH && !FINAL_STATUSES.has(status);

export const canOpenOrder = (id: string) =>
  id.length >= MIN_PERSISTED_ID_LENGTH;

export { appointmentOrderLink as orderLink } from "@/features/orders/orders.utils";

export function useCompleteAppointment(id: string) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const complete = async () => {
    setPending(true);
    setFailed(false);
    try {
      await updateAppointmentStatus(id, "COMPLETED");
      router.push(appointmentOrderLink(id));
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  };

  return { complete, failed, pending };
}
