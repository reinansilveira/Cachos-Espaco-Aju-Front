import { describe, expect, it } from "vitest";
import {
  buildDays,
  calendarInvite,
  depositOf,
  formatDuration,
  friendlySlot,
  groupCatalog,
  groupSlots,
  maskPhone,
  money,
  openStatus,
  recommend,
  startingPrice,
  validateContact,
} from "./salon.utils";
import type { CatalogService } from "./salon.types";

const service = (
  name: string,
  category: string,
  price = 100,
): CatalogService => ({
  id: name,
  name,
  category,
  description: null,
  price,
  duration: 60,
});

const catalog = [
  service("Corte", "Design de Corte", 140),
  service("Corte + Hidronutrição", "Combos", 220),
  service("Corte + Protocolo Antiporosidade", "Combos", 240),
  service("Hidronutrição Capilar", "Tratamentos", 130),
  service("Protocolo HNR", "Tratamentos", 130),
  service("Penteado", "Penteados", 110),
];

// Datas em UTC; Aracaju é UTC-3.
const at = (iso: string) => new Date(iso);

describe("openStatus", () => {
  it("aberto em uma terça às 10h", () => {
    expect(openStatus(at("2026-11-17T13:00:00Z"))).toEqual({
      open: true,
      label: "Aberto agora · fecha às 18h",
    });
  });

  it("sábado antes das 8h abre hoje", () => {
    expect(openStatus(at("2026-11-14T10:30:00Z")).label).toBe(
      "Fechado · abre hoje às 8h",
    );
  });

  it("sábado à noite só abre na terça", () => {
    expect(openStatus(at("2026-11-14T22:00:00Z")).label).toBe(
      "Fechado · abre terça às 9h",
    );
  });

  it("segunda abre amanhã", () => {
    expect(openStatus(at("2026-11-16T15:00:00Z")).label).toBe(
      "Fechado · abre amanhã às 9h",
    );
  });
});

describe("buildDays", () => {
  it("marca domingo e segunda como fechados", () => {
    const days = buildDays("2026-11-14", 3);
    expect(days.map((day) => [day.label, day.closed])).toEqual([
      ["Hoje", false],
      ["Amanhã", true],
      ["Seg", true],
    ]);
  });
});

describe("groupSlots e friendlySlot", () => {
  it("separa manhã e tarde no horário de Aracaju", () => {
    const groups = groupSlots([
      { id: "a", startsAt: "2026-11-17T12:00:00Z" },
      { id: "b", startsAt: "2026-11-17T18:00:00Z" },
    ]);
    expect(groups.map((group) => [group.label, group.slots.length])).toEqual([
      ["Manhã", 1],
      ["Tarde", 1],
    ]);
  });

  it("escreve o próximo horário de forma natural", () => {
    const now = at("2026-11-17T12:00:00Z");
    expect(friendlySlot("2026-11-17T18:00:00Z", now)).toBe("hoje às 15h");
    expect(friendlySlot("2026-11-18T12:00:00Z", now)).toBe("amanhã às 09h");
  });
});

describe("catálogo", () => {
  it("agrupa por intenção e ignora intenções sem serviço", () => {
    const groups = groupCatalog(catalog);
    expect(groups.map((group) => [group.id, group.services.length])).toEqual([
      ["cortar", 3],
      ["tratar", 2],
      ["ocasioes", 1],
    ]);
    expect(startingPrice(groups[0].services)).toBe(140);
  });

  it("recomenda pelo tipo de cabelo e objetivo", () => {
    expect(
      recommend(catalog, "crespo", "corte").map((item) => item.name),
    ).toEqual(["Corte + Hidronutrição", "Corte"]);
    expect(recommend(catalog, "transicao", "corte")[0].name).toBe(
      "Corte + Protocolo Antiporosidade",
    );
    expect(
      recommend(catalog, "cacheado", "saude").map((item) => item.name),
    ).toEqual(["Hidronutrição Capilar", "Protocolo HNR"]);
  });

  it("formata duração", () => {
    expect(formatDuration(90)).toBe("1h30");
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(null)).toBe("");
  });
});

describe("contato", () => {
  it("mascara o WhatsApp", () => {
    expect(maskPhone("79981750872")).toBe("(79) 98175-0872");
  });

  it("valida nome, WhatsApp e e-mail", () => {
    expect(validateContact({ name: "A", phone: "", email: "" })).toBe(
      "Como podemos te chamar?",
    );
    expect(validateContact({ name: "Ana", phone: "799", email: "" })).toBe(
      "Confira o WhatsApp com DDD.",
    );
    expect(
      validateContact({
        name: "Ana",
        phone: "79981750872",
        email: "ana@x.com",
      }),
    ).toBeNull();
  });

  it("gera o convite de agenda", () => {
    const invite = decodeURIComponent(
      calendarInvite({
        startsAt: "2026-11-17T18:00:00Z",
        minutes: 90,
        title: "Corte",
        location: "Rua Maruim",
      }),
    );
    expect(invite).toContain("DTSTART:20261117T180000Z");
    expect(invite).toContain("DTEND:20261117T193000Z");
  });
});

describe("sinal e valores", () => {
  it("sinal é 20% em centavos, como na API", () => {
    expect(depositOf(140)).toBe(28);
    expect(depositOf(107)).toBe(21.4);
  });

  it("mostra centavos só quando há", () => {
    // O Intl separa "R$" do número com espaço não separável.
    expect(money(140).replace(/\s/g, " ")).toBe("R$ 140");
    expect(money(21.4).replace(/\s/g, " ")).toBe("R$ 21,40");
  });
});
