import { cn } from "@/utils/class-names";
import { GOOGLE, VIDEOS } from "../salon.data";
import type { CatalogService, TeamMember } from "../salon.types";
import { openStatus } from "../salon.utils";
import { BookingFlow } from "../booking/BookingFlow";
import { WaveEdge } from "./Shapes";
import { Stars } from "./Stars";

export function Hero({
  catalog,
  team,
}: {
  catalog: CatalogService[];
  team: TeamMember[];
}) {
  const status = openStatus();

  return (
    <section className="s-hero" id="inicio">
      {/* Tour gravado no salão: horizontal no computador, vertical no
          celular. Enquanto carrega, aparece o primeiro quadro (fundo no CSS). */}
      <div className="s-hero__media" aria-hidden="true">
        <video
          className="s-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={VIDEOS.tourVertical}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src={VIDEOS.tour} type="video/mp4" />
        </video>
      </div>
      <div className="s-hero__veil" aria-hidden="true" />

      <div className="s-hero__inner">
        <div className="s-hero__copy">
          <p className={cn("s-status", status.open && "s-status--open")}>
            <i aria-hidden="true" />
            {status.label}
          </p>

          <h1 className="s-hero__title">
            Cada cacho tem sua forma.
            <em> A gente respeita todas.</em>
          </h1>

          <p className="s-hero__lead">
            Salão especializado em cacheadas, crespas, onduladas e em quem está
            em transição capilar. Rua Maruim, 766, Centro de Aracaju.
          </p>

          <a
            className="s-hero__rating"
            href={GOOGLE.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>5,0</strong>
            <span>
              <Stars className="s-stars" />
              {GOOGLE.count} avaliações no Google
            </span>
          </a>
        </div>

        <div className="s-hero__book" id="agendar">
          <BookingFlow catalog={catalog} team={team} initial={{}} compact />
        </div>
      </div>

      <WaveEdge className="s-hero__edge" />
    </section>
  );
}
