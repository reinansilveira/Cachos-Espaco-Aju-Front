import { appointmentStatus } from "./appointment-status.utils";

export function AppointmentStatusBadge({ status }: { status: string }) {
  const { label, tone } = appointmentStatus(status);

  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span className="status-badge__dot" />
      {label}
    </span>
  );
}
