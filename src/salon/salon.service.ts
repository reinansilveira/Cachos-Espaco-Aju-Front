import { serverApi } from "@/services/api/server";
import type { ProfessionalResponseDto } from "@/services/professional";
import type { ProfessionalService, Service } from "@/services/service";
import { TEAM_EXTRA } from "./salon.data";
import type { CatalogService, TeamMember } from "./salon.types";

// Leituras do site no servidor. Com a API fora do ar o site abre sem catálogo
// e sem equipe, em vez de quebrar.

export async function getCatalog(): Promise<CatalogService[]> {
  const services = await serverApi<Service[]>({ url: "/services" }).catch(
    (): Service[] => [],
  );
  return services
    .filter((service) => service.active)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((service) => ({
      id: service.id,
      name: service.name,
      category: service.category ?? "",
      description: service.description ?? null,
      price: Number(service.price),
      duration: service.duration ?? null,
    }));
}

export async function getTeam(): Promise<TeamMember[]> {
  const professionals = await serverApi<ProfessionalResponseDto[]>({
    url: "/professionals",
    params: { active: "true" },
  }).catch((): ProfessionalResponseDto[] => []);

  const team = await Promise.all(
    professionals.map(async (professional) => {
      const links = await serverApi<ProfessionalService[]>({
        url: "/professional-services",
        params: { professionalId: professional.id },
      }).catch((): ProfessionalService[] => []);
      const firstName = professional.user.name.split(" ")[0];
      const extra = TEAM_EXTRA[firstName];
      return {
        id: professional.id,
        name: professional.user.name,
        firstName,
        role: professional.specialty ?? "Especialista em cachos",
        bio: professional.bio ?? "",
        avatar: professional.user.avatar ?? null,
        serviceIds: links
          .filter((link) => link.active)
          .map((link) => link.serviceId),
        instagram: extra?.instagram ?? null,
        whatsapp: extra?.whatsapp ?? null,
      };
    }),
  );
  // Quem faz mais serviços (a dona, Linnda) aparece primeiro.
  return team.sort((a, b) => b.serviceIds.length - a.serviceIds.length);
}
