"use client";

import {
  canCompleteAppointment,
  canOpenOrder,
  orderLink,
  useCompleteAppointment,
} from "../hooks/use-complete-appointment";

export const AppointmentStatusAction = ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const action = useCompleteAppointment(id);

  if (status === "COMPLETED" && canOpenOrder(id)) {
    return <a href={orderLink(id)}>Comanda</a>;
  }
  if (!canCompleteAppointment(id, status)) return null;

  return (
    <button
      type="button"
      onClick={action.complete}
      disabled={action.pending}
      title={
        action.failed
          ? "Não foi possível concluir. Tente novamente."
          : undefined
      }
    >
      {action.pending ? "Salvando…" : "Concluir"}
    </button>
  );
};
