import {
  INTENTS,
  OPENING,
  RECOMMENDATIONS,
  type GoalId,
  type IntentId,
  type TextureId,
} from "./salon.data";
import type { CatalogService, Slot } from "./salon.types";

export const SALON_TZ = "America/Maceio";

// Relógio de Aracaju (UTC-3, sem horário de verão), independente do servidor.
function salonParts(now: Date) {
  const local = new Date(now.getTime() - 3 * 3600_000);
  return {
    day: local.getUTCDay(),
    hour: local.getUTCHours() + local.getUTCMinutes() / 60,
    key: local.toISOString().slice(0, 10),
  };
}

const WEEKDAYS = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

export function openStatus(now = new Date()) {
  const { day, hour } = salonParts(now);
  const today = OPENING[day];
  if (today && hour >= today.open && hour < today.close) {
    return { open: true, label: `Aberto agora · fecha às ${today.close}h` };
  }
  for (
    let offset = today && hour < today.open ? 0 : 1;
    offset <= 7;
    offset += 1
  ) {
    const next = OPENING[(day + offset) % 7];
    if (!next) continue;
    const when =
      offset === 0
        ? "hoje"
        : offset === 1
          ? "amanhã"
          : WEEKDAYS[(day + offset) % 7];
    return { open: false, label: `Fechado · abre ${when} às ${next.open}h` };
  }
  return { open: false, label: "Fechado" };
}

export function todayKey(now = new Date()) {
  return salonParts(now).key;
}

export function buildDays(start: string, count: number) {
  const base = new Date(`${start}T12:00:00Z`);
  const short = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    timeZone: "UTC",
  });
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() + index);
    const raw =
      index === 0
        ? "Hoje"
        : index === 1
          ? "Amanhã"
          : short.format(date).replace(".", "");
    return {
      key: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      label: raw.charAt(0).toUpperCase() + raw.slice(1),
      closed: !OPENING[date.getUTCDay()],
    };
  });
}

const hourOf = (startsAt: string) =>
  Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: SALON_TZ,
      hour: "2-digit",
      hour12: false,
    }).format(new Date(startsAt)),
  );

export function groupSlots(slots: Slot[]) {
  const groups = [
    { label: "Manhã", slots: [] as Slot[] },
    { label: "Tarde", slots: [] as Slot[] },
  ];
  for (const slot of slots)
    groups[hourOf(slot.startsAt) < 12 ? 0 : 1].slots.push(slot);
  return groups.filter((group) => group.slots.length);
}

export const timeOf = (startsAt: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: SALON_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));

export function longDate(startsAt: string) {
  const text = new Intl.DateTimeFormat("pt-BR", {
    timeZone: SALON_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(startsAt));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// "hoje às 15h", "amanhã às 9h", "terça, 18/11 às 10h".
export function friendlySlot(startsAt: string, now = new Date()) {
  const key = todayKey(new Date(startsAt));
  const today = todayKey(now);
  const tomorrow = todayKey(new Date(now.getTime() + 86_400_000));
  const time = timeOf(startsAt).replace(":00", "h").replace(":", "h");
  if (key === today) return `hoje às ${time}`;
  if (key === tomorrow) return `amanhã às ${time}`;
  const day = new Intl.DateTimeFormat("pt-BR", {
    timeZone: SALON_TZ,
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(startsAt));
  return `${day} às ${time}`;
}

export function formatDuration(minutes: number | null) {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h${String(rest).padStart(2, "0")}` : `${hours}h`;
}

// Sinal do agendamento online (20%), igual à regra da API.
export const depositOf = (price: number) => Math.round(price * 20) / 100;

// Valores redondos sem centavos ("R$ 140"); quebrados com ("R$ 21,40").
export const money = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export function groupCatalog(catalog: CatalogService[]) {
  return INTENTS.map((intent) => ({
    ...intent,
    services: catalog.filter((service) =>
      (intent.categories as readonly string[]).includes(service.category),
    ),
  })).filter((intent) => intent.services.length);
}

export function intentOf(
  service: Pick<CatalogService, "category">,
): IntentId | null {
  return (
    INTENTS.find((intent) =>
      (intent.categories as readonly string[]).includes(service.category),
    )?.id ?? null
  );
}

export function startingPrice(services: CatalogService[]) {
  return services.length
    ? Math.min(...services.map((service) => service.price))
    : null;
}

export function recommend(
  catalog: CatalogService[],
  texture: TextureId,
  goal: GoalId,
) {
  const rule = RECOMMENDATIONS[goal];
  const names = rule[texture] ?? rule.default;
  return names
    .map((name) => catalog.find((service) => service.name === name))
    .filter((service): service is CatalogService => Boolean(service));
}

export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validateContact(input: {
  name: string;
  phone: string;
  email: string;
}) {
  if (input.name.trim().length < 2) return "Como podemos te chamar?";
  if (!/^\d{10,11}$/.test(input.phone.replace(/\D/g, "")))
    return "Confira o WhatsApp com DDD.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    return "Confira o e-mail.";
  return null;
}

export const whatsappLink = (digits: string, message?: string) =>
  `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

// Convite de agenda (.ics) para a cliente salvar o horário no celular.
export function calendarInvite(input: {
  startsAt: string;
  minutes: number;
  title: string;
  location: string;
}) {
  const start = new Date(input.startsAt);
  const end = new Date(start.getTime() + input.minutes * 60_000);
  const stamp = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Espaco Cachos Aju//Agenda//PT",
    "BEGIN:VEVENT",
    `UID:${stamp(start)}@cachosaju`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${input.title}`,
    `LOCATION:${input.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
