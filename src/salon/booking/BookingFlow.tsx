"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/class-names";
import { VISIT, WHATSAPP } from "../salon.data";
import type { CatalogService, TeamMember } from "../salon.types";
import {
  calendarInvite,
  depositOf,
  formatDuration,
  groupSlots,
  longDate,
  money,
  timeOf,
  whatsappLink,
} from "../salon.utils";
import { CurlMark } from "../components/Shapes";
import { DepositStep } from "./DepositStep";
import { useBooking, type BookingStep } from "./use-booking";

function Step({
  number,
  title,
  current,
  summary,
  onEdit,
  hidden,
  children,
}: {
  number: BookingStep;
  title: string;
  current: BookingStep;
  summary?: ReactNode;
  onEdit: () => void;
  hidden?: boolean;
  children: ReactNode;
}) {
  if (hidden) return null;
  const open = current === number;
  const done = current > number && Boolean(summary);
  return (
    <section
      className={cn("s-step", open && "s-step--open", done && "s-step--done")}
    >
      <header className="s-step__head">
        <span className="s-step__num" aria-hidden="true">
          {done ? "✓" : number}
        </span>
        <h2>{title}</h2>
        {!open && done && (
          <>
            <span className="s-step__summary">{summary}</span>
            <button type="button" className="s-step__edit" onClick={onEdit}>
              Trocar
            </button>
          </>
        )}
      </header>
      {open && <div className="s-step__body">{children}</div>}
    </section>
  );
}

export function BookingFlow({
  catalog,
  team,
  initial,
  compact = false,
}: {
  catalog: CatalogService[];
  team: TeamMember[];
  // Versão do hero: sem título grande e com o resumo no rodapé do cartão.
  compact?: boolean;
  initial: {
    serviceId?: string;
    professionalId?: string;
    date?: string;
    slotId?: string;
  };
}) {
  const flow = useBooking(catalog, team, initial);
  const deposit = flow.service ? depositOf(flow.service.price) : 0;

  if (flow.booked && !flow.finished && flow.service && flow.professional) {
    return (
      <DepositStep
        appointmentId={flow.booked.appointmentId}
        amount={deposit}
        total={flow.service.price}
        summary={`${flow.service.name} com ${flow.professional.firstName}, ${longDate(flow.booked.startsAt).toLowerCase()} às ${timeOf(flow.booked.startsAt)}`}
        onPaid={() => flow.finish("paid")}
        onLater={() => flow.finish("later")}
      />
    );
  }

  if (flow.booked && flow.finished && flow.service && flow.professional) {
    const paid = flow.finished === "paid";
    const when = `${longDate(flow.booked.startsAt)} às ${timeOf(flow.booked.startsAt)}`;
    const message = `Oi! Acabei de agendar pelo site: ${flow.service.name} com ${flow.professional.firstName}, ${when}. Meu nome é ${flow.name.trim()}. ${paid ? "Já paguei o sinal 🤎" : "Como faço o sinal? 🤎"}`;
    return (
      <div className="s-done">
        <CurlMark className="s-done__mark" />
        <p className="s-eyebrow">
          {paid ? "Horário confirmado" : "Horário reservado"}
        </p>
        <h1 className="s-title">
          Te esperamos, <em>{flow.name.trim().split(" ")[0]}!</em>
        </h1>
        <dl className="s-ticket">
          <div>
            <dt>Serviço</dt>
            <dd>{flow.service.name}</dd>
          </div>
          <div>
            <dt>Com</dt>
            <dd>{flow.professional.name}</dd>
          </div>
          <div>
            <dt>Quando</dt>
            <dd>{when}</dd>
          </div>
          <div>
            <dt>Onde</dt>
            <dd>
              {VISIT.street} · {VISIT.note}
            </dd>
          </div>
          <div>
            <dt>{paid ? "Sinal pago" : "Sinal (20%)"}</dt>
            <dd>{money(deposit)}</dd>
          </div>
          <div>
            <dt>{paid ? "No dia você paga" : "Valor do serviço"}</dt>
            <dd>
              {money(paid ? flow.service.price - deposit : flow.service.price)}
            </dd>
          </div>
        </dl>
        <p className="s-done__note">
          {paid
            ? "Sinal recebido: seu horário está confirmado. A confirmação vai para o seu e-mail."
            : `O horário fica reservado até a gente receber o sinal de ${money(deposit)}. Chame a gente no WhatsApp para combinar.`}
        </p>
        <div className="s-done__actions">
          <a
            className={cn(
              "s-btn s-btn--lg",
              paid ? "s-btn--line" : "s-btn--gold",
            )}
            href={whatsappLink(flow.professional.whatsapp ?? WHATSAPP, message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {paid ? "Avisar no WhatsApp" : "Combinar o sinal no WhatsApp"}
          </a>
          <a
            className="s-btn s-btn--line s-btn--lg"
            href={calendarInvite({
              startsAt: flow.booked.startsAt,
              minutes: flow.service.duration ?? 60,
              title: `${flow.service.name} · Espaço Cachos Aju`,
              location: `${VISIT.street}, ${VISIT.district}`,
            })}
            download="cachos-aju.ics"
          >
            Salvar na agenda
          </a>
          <Link href="/" className="s-link">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const activeGroup = flow.groups.find((group) => group.id === flow.intentId);

  return (
    <div className={cn("s-booking", compact && "s-booking--compact")}>
      <div className="s-booking__steps">
        {compact ? (
          <p className="s-booking__compact-title">
            Agende <em>agora</em>
          </p>
        ) : (
          <header className="s-booking__head">
            <p className="s-eyebrow">Agendamento online</p>
            <h1 className="s-title">
              Seu horário em <em>quatro passos.</em>
            </h1>
          </header>
        )}

        <Step
          number={1}
          title="O que você vai fazer?"
          current={flow.step}
          onEdit={() => flow.goTo(1)}
          summary={
            flow.service &&
            `${flow.service.name} · ${money(flow.service.price)}`
          }
        >
          <div
            className="s-menu__tabs s-menu__tabs--compact"
            role="tablist"
            aria-label="Tipos de serviço"
          >
            {flow.groups.map((group) => (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={group.id === flow.intentId}
                className={cn(
                  "s-tab",
                  group.id === flow.intentId && "s-tab--active",
                )}
                onClick={() => flow.setIntentId(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>
          <ul className="s-options">
            {activeGroup?.services.map((service) => (
              <li key={service.id}>
                <button
                  type="button"
                  className={cn(
                    "s-option",
                    flow.service?.id === service.id && "s-option--active",
                  )}
                  onClick={() => flow.chooseService(service.id)}
                >
                  <span className="s-option__text">
                    <strong>{service.name}</strong>
                    {service.description && (
                      <small>{service.description}</small>
                    )}
                  </span>
                  <span className="s-option__meta">
                    <strong>{money(service.price)}</strong>
                    <small>{formatDuration(service.duration)}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Step>

        <Step
          number={2}
          title="Com quem?"
          current={flow.step}
          hidden={flow.lockedPro && flow.step !== 2}
          onEdit={() => flow.goTo(2)}
          summary={flow.professional?.name}
        >
          <div className="s-pros">
            {flow.pros.map((member) => (
              <button
                key={member.id}
                type="button"
                className={cn(
                  "s-pro",
                  flow.professional?.id === member.id && "s-pro--active",
                )}
                onClick={() => flow.chooseProfessional(member.id)}
              >
                <span className="s-pro__avatar" aria-hidden="true">
                  {member.firstName.charAt(0)}
                </span>
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </button>
            ))}
            {flow.pros.length === 0 && (
              <p className="s-empty">
                Nenhuma profissional faz esse serviço pelo site. Chame a gente
                no WhatsApp.
              </p>
            )}
          </div>
        </Step>

        <Step
          number={3}
          title="Quando?"
          current={flow.step}
          onEdit={() => flow.goTo(3)}
          summary={
            flow.slot &&
            `${longDate(flow.slot.startsAt)} às ${timeOf(flow.slot.startsAt)}`
          }
        >
          <div className="s-days" role="group" aria-label="Dia">
            {flow.days.map((day) => {
              const unavailable =
                day.closed ||
                (flow.available ? !flow.available.has(day.key) : false);
              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={unavailable}
                  aria-pressed={flow.date === day.key}
                  className={cn(
                    "s-day",
                    flow.date === day.key && "s-day--active",
                  )}
                  onClick={() => flow.chooseDate(day.key)}
                >
                  <small>{day.closed ? "Fechado" : day.label}</small>
                  <strong>{day.day}</strong>
                </button>
              );
            })}
          </div>

          {flow.loadingSlots ? (
            <p className="s-empty">Procurando horários…</p>
          ) : flow.slots.length === 0 ? (
            <div className="s-next-day">
              <p>
                Esse dia não tem horário em que o serviço caiba inteiro.
                {!flow.nextDay && " Fale com a gente no WhatsApp."}
              </p>
              {flow.nextDay && (
                <button
                  type="button"
                  className="s-btn s-btn--dark s-btn--sm"
                  onClick={() => flow.chooseDate(flow.nextDay!.key)}
                >
                  Ver {flow.nextDay.label.toLowerCase()}, dia {flow.nextDay.day}{" "}
                  →
                </button>
              )}
            </div>
          ) : (
            groupSlots(flow.slots).map((group) => (
              <div key={group.label} className="s-slots">
                <p>{group.label}</p>
                <div className="s-slots__grid">
                  {group.slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={cn(
                        "s-slot",
                        flow.slot?.id === slot.id && "s-slot--active",
                      )}
                      onClick={() => flow.chooseSlot(slot.id)}
                    >
                      {timeOf(slot.startsAt)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </Step>

        <Step
          number={4}
          title="Seus dados"
          current={flow.step}
          onEdit={() => flow.goTo(4)}
        >
          <form className="s-form" onSubmit={flow.submit} noValidate>
            <label>
              Nome
              <input
                value={flow.name}
                onChange={(event) => flow.setName(event.target.value)}
                autoComplete="name"
                placeholder="Como podemos te chamar?"
              />
            </label>
            <label>
              WhatsApp
              <input
                value={flow.phone}
                onChange={(event) => flow.setPhone(event.target.value)}
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(79) 99999-9999"
              />
            </label>
            <label className="s-form__wide">
              E-mail
              <input
                value={flow.email}
                onChange={(event) => flow.setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder="Para mandar a confirmação"
              />
            </label>
            <button
              type="submit"
              className="s-btn s-btn--gold s-btn--lg s-form__wide"
              disabled={flow.submitting}
            >
              {flow.submitting
                ? "Reservando…"
                : `Reservar e pagar o sinal de ${money(deposit)}`}
            </button>
          </form>
        </Step>

        {flow.error && (
          <p className="s-error" role="alert">
            {flow.error}
          </p>
        )}
      </div>

      {compact ? (
        flow.service && (
          <p className="s-booking__bar">
            <span>
              {flow.service.name}
              {flow.slot &&
                ` · ${longDate(flow.slot.startsAt)}, ${timeOf(flow.slot.startsAt)}`}
            </span>
            <strong>{money(flow.service.price)}</strong>
            <small>
              Sinal de {money(deposit)} no Pix ou cartão confirma o horário
            </small>
          </p>
        )
      ) : (
        <aside className="s-summary" aria-label="Resumo do agendamento">
          <p className="s-summary__title">Seu horário</p>
          <dl>
            <div>
              <dt>Serviço</dt>
              <dd>{flow.service?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Com</dt>
              <dd>{flow.professional?.name ?? "—"}</dd>
            </div>
            <div>
              <dt>Quando</dt>
              <dd>
                {flow.slot
                  ? `${longDate(flow.slot.startsAt)}, ${timeOf(flow.slot.startsAt)}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Duração</dt>
              <dd>
                {flow.service ? formatDuration(flow.service.duration) : "—"}
              </dd>
            </div>
          </dl>
          <div className="s-summary__total">
            <span>Total</span>
            <strong>{flow.service ? money(flow.service.price) : "—"}</strong>
          </div>
          {flow.service && (
            <p className="s-summary__note">
              Sinal de {money(deposit)} (20%) para garantir o horário,
              descontado no dia. Remarque uma vez avisando com 24h.
            </p>
          )}
        </aside>
      )}
    </div>
  );
}
