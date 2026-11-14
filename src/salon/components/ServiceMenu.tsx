"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/class-names";
import type { CatalogService } from "../salon.types";
import { formatDuration, money, startingPrice } from "../salon.utils";
import { useServiceMenu } from "../hooks/use-service-menu";
import { Blob, WaveEdge } from "./Shapes";

export function ServiceMenu({ catalog }: { catalog: CatalogService[] }) {
  const menu = useServiceMenu(catalog);
  if (!menu.active) return null;
  const from = startingPrice(menu.active.services);

  return (
    <section className="s-menu" id="servicos">
      <WaveEdge className="s-menu__edge" />
      <Blob variant="curl" className="s-menu__curl" />
      <header className="s-head s-head--row" data-reveal>
        <div>
          <p className="s-eyebrow">Serviços</p>
          <h2 className="s-title">
            O que você <em>quer hoje?</em>
          </h2>
        </div>
        <p className="s-head__text">
          Valores do salão. O tempo inclui lavagem, fitagem e secagem quando o
          serviço pede.
        </p>
      </header>

      <div
        className="s-menu__tabs"
        role="tablist"
        aria-label="Tipos de serviço"
      >
        {menu.groups.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            id={`tab-${group.id}`}
            aria-selected={group.id === menu.active.id}
            aria-controls="painel-servicos"
            className={cn(
              "s-tab",
              group.id === menu.active.id && "s-tab--active",
            )}
            onClick={() => menu.select(group.id)}
          >
            {group.label}
            <small>{group.services.length}</small>
          </button>
        ))}
      </div>

      <div
        className="s-menu__panel"
        id="painel-servicos"
        role="tabpanel"
        aria-labelledby={`tab-${menu.active.id}`}
      >
        <aside className="s-menu__feature" key={menu.active.id}>
          <Image
            src={menu.active.photo}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 36vw"
          />
          <div className="s-menu__feature-copy">
            <h3>{menu.active.title}</h3>
            <p>{menu.active.text}</p>
            {from !== null && (
              <span>
                a partir de <strong>{money(from)}</strong>
              </span>
            )}
          </div>
        </aside>

        <ul className="s-menu__list">
          {menu.active.services.map((service) => (
            <li key={service.id} className="s-item">
              <div className="s-item__text">
                <h4>{service.name}</h4>
                {service.description && <p>{service.description}</p>}
              </div>
              <div className="s-item__meta">
                <strong>{money(service.price)}</strong>
                <small>{formatDuration(service.duration)}</small>
              </div>
              <Link
                href={`/agendar?servico=${service.id}`}
                prefetch={false}
                className="s-item__book"
                aria-label={`Agendar ${service.name}`}
              >
                Agendar <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <WaveEdge className="s-menu__edge s-menu__edge--bottom" />
    </section>
  );
}
