import Image from "next/image";
import { cn } from "@/utils/class-names";
import { GOOGLE, PHOTOS, VISIT } from "../salon.data";
import { openStatus } from "../salon.utils";

export function VisitSection() {
  const status = openStatus();

  return (
    <section className="s-visit" id="visite">
      <div className="s-visit__card" data-reveal>
        <p className="s-eyebrow">Visite</p>
        <h2 className="s-title">
          No coração <em>do Centro.</em>
        </h2>
        <p className={cn("s-status", status.open && "s-status--open")}>
          <i aria-hidden="true" />
          {status.label}
        </p>
        <address>
          {VISIT.street}
          <small>
            {VISIT.note} · {VISIT.district}
          </small>
        </address>
        <dl className="s-visit__hours">
          {VISIT.hours.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.time}</dd>
            </div>
          ))}
        </dl>
        <ul className="s-visit__perks">
          {VISIT.perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
        <p className="s-visit__pay">{VISIT.payments}</p>
        <a
          href={GOOGLE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="s-btn s-btn--dark"
        >
          Como chegar <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="s-visit__media" data-reveal>
        <div className="s-visit__photo">
          <Image
            src={PHOTOS.facadeNight}
            alt="Entrada do salão iluminada"
            fill
            sizes="(max-width: 900px) 100vw, 30vw"
          />
        </div>
        <div className="s-visit__map">
          <iframe
            title="Mapa do Espaço Cachos Aju"
            src={VISIT.mapEmbed}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
