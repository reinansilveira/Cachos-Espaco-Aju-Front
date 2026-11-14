import { describe, expect, it } from "vitest";
import { appointmentStatus, scheduleState } from "./appointment-status.utils";

describe("appointmentStatus", () => {
  it("diferencia confirmado de concluído", () => {
    expect(appointmentStatus("CONFIRMED").label).toBe("Confirmado");
    expect(appointmentStatus("COMPLETED").label).toBe("Concluído");
  });

  it("mostra falta e cancelamento", () => {
    expect(appointmentStatus("NO_SHOW")).toEqual({
      label: "Faltou",
      tone: "no-show",
    });
    expect(appointmentStatus("cancelled").label).toBe("Cancelado");
  });

  it("trata status desconhecido como pendente", () => {
    expect(appointmentStatus("WHATEVER").label).toBe("Pendente");
  });
});

describe("scheduleState", () => {
  const now = new Date("2026-11-14T15:00:00-03:00");
  const at = (time: string, status = "CONFIRMED", duration = 60) => ({
    scheduledAt: `2026-11-14T${time}:00-03:00`,
    duration,
    status,
  });

  it("usa o horário e não a posição na lista", () => {
    expect(scheduleState(at("09:00"), now)).toBe("done");
    expect(scheduleState(at("14:30"), now)).toBe("now");
    expect(scheduleState(at("16:00"), now)).toBe("upcoming");
  });

  it("concluído ou cancelado conta como feito mesmo no futuro", () => {
    expect(scheduleState(at("17:00", "CANCELLED"), now)).toBe("done");
  });
});
