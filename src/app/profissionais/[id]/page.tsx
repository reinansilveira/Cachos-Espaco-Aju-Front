import { redirect } from "next/navigation";

// O perfil virou o agendamento com a profissional já escolhida.
export default async function ProfessionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  redirect(`/agendar?profissional=${(await params).id}`);
}
