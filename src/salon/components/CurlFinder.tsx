"use client";

import Link from "next/link";
import { cn } from "@/utils/class-names";
import { GOALS, TEXTURES } from "../salon.data";
import type { CatalogService } from "../salon.types";
import { formatDuration, money } from "../salon.utils";
import { useCurlFinder } from "../hooks/use-curl-finder";
import { Blob, CurlMark } from "./Shapes";

export function CurlFinder({ catalog }: { catalog: CatalogService[] }) {
  const finder = useCurlFinder(catalog);
  const ready = finder.picks.length > 0;

  return (
    <section className="s-finder" id="seu-cacho">
      <Blob variant="curl" className="s-finder__curl" />

      <header className="s-head" data-reveal>
        <p className="s-eyebrow">Descubra seu cuidado</p>
        <h2 className="s-title">
          Conta pra gente sobre <em>o seu cabelo.</em>
        </h2>
        <p className="s-head__text">
          Dois toques e a gente indica por onde começar, com valor e tempo de
          atendimento.
        </p>
      </header>

      <div className="s-finder__board" data-reveal>
        <fieldset className="s-finder__step">
          <legend>
            <span>1</span> Qual é a sua textura?
          </legend>
          <div className="s-finder__options s-finder__options--four">
            {TEXTURES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={finder.texture === item.id}
                className={cn(
                  "s-choice",
                  finder.texture === item.id && "s-choice--active",
                )}
                onClick={() => finder.setTexture(item.id)}
              >
                <CurlMark
                  className={cn("s-choice__curl", `s-choice__curl--${item.id}`)}
                />
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="s-finder__step" disabled={!finder.texture}>
          <legend>
            <span>2</span> O que você quer agora?
          </legend>
          <div className="s-finder__options">
            {GOALS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={finder.goal === item.id}
                className={cn(
                  "s-pill",
                  finder.goal === item.id && "s-pill--active",
                )}
                onClick={() => finder.setGoal(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div
          className={cn("s-finder__result", ready && "s-finder__result--ready")}
          aria-live="polite"
        >
          {ready ? (
            <>
              <p className="s-finder__tip">{finder.tip}</p>
              <div className="s-finder__picks">
                {finder.picks.map((service, index) => (
                  <article
                    key={service.id}
                    className={cn("s-pick", index === 0 && "s-pick--main")}
                  >
                    <span className="s-pick__badge">
                      {index === 0 ? "Indicação da casa" : "Também combina"}
                    </span>
                    <h3>{service.name}</h3>
                    {service.description && <p>{service.description}</p>}
                    <div className="s-pick__meta">
                      <span>{money(service.price)}</span>
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    <Link
                      href={`/agendar?servico=${service.id}`}
                      prefetch={false}
                      className={cn(
                        "s-btn",
                        index === 0 ? "s-btn--gold" : "s-btn--line",
                      )}
                    >
                      Agendar este
                    </Link>
                  </article>
                ))}
              </div>
              <button type="button" className="s-link" onClick={finder.reset}>
                Recomeçar
              </button>
            </>
          ) : (
            <p className="s-finder__empty">
              {finder.texture
                ? "Agora escolha o que você quer, que a gente indica o serviço."
                : "Escolha a sua textura para começar."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
