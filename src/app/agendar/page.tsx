import "@/salon/salon.scss";
import type { Metadata } from "next";
import { BookingFlow } from "@/salon/booking/BookingFlow";
import { FloatingBook } from "@/salon/components/FloatingBook";
import { Header } from "@/salon/components/Header";
import { SalonShell } from "@/salon/components/SalonShell";
import { getCatalog, getTeam } from "@/salon/salon.service";

export const metadata: Metadata = { title: "Agendar" };
export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{
    servico?: string;
    profissional?: string;
    data?: string;
    horario?: string;
  }>;
}) {
  const [{ servico, profissional, data, horario }, catalog, team] =
    await Promise.all([searchParams, getCatalog(), getTeam()]);

  return (
    <SalonShell>
      <Header tone="light" />
      <main className="s-booking-page">
        <BookingFlow
          catalog={catalog}
          team={team}
          initial={{
            serviceId: servico,
            professionalId: profissional,
            date: data,
            slotId: horario,
          }}
        />
      </main>
      <FloatingBook showBook={false} />
    </SalonShell>
  );
}
