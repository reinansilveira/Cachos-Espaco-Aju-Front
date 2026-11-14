import "@/salon/salon.scss";
import { Agreements } from "@/salon/components/Agreements";
import { CurlFinder } from "@/salon/components/CurlFinder";
import { FloatingBook } from "@/salon/components/FloatingBook";
import { Header } from "@/salon/components/Header";
import { Hero } from "@/salon/components/Hero";
import { Reviews } from "@/salon/components/Reviews";
import { SalonFooter } from "@/salon/components/SalonFooter";
import { SalonShell } from "@/salon/components/SalonShell";
import { ServiceMenu } from "@/salon/components/ServiceMenu";
import { SpaceStory } from "@/salon/components/SpaceStory";
import { TeamSection } from "@/salon/components/TeamSection";
import { VisitSection } from "@/salon/components/VisitSection";
import { getCatalog, getTeam } from "@/salon/salon.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [catalog, team] = await Promise.all([getCatalog(), getTeam()]);

  return (
    <SalonShell>
      <Header bookHref="#agendar" />
      <Hero catalog={catalog} team={team} />
      <CurlFinder catalog={catalog} />
      <ServiceMenu catalog={catalog} />
      <SpaceStory />
      <TeamSection team={team} />
      <Reviews />
      <Agreements />
      <VisitSection />
      <SalonFooter />
      <FloatingBook bookHref="#agendar" />
    </SalonShell>
  );
}
