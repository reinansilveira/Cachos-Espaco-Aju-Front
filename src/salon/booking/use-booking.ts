"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import { book, fetchOpenDates, fetchSlots } from "../salon.api";
import type { CatalogService, Slot, TeamMember } from "../salon.types";
import {
  buildDays,
  groupCatalog,
  maskPhone,
  todayKey,
  validateContact,
} from "../salon.utils";

const DAYS_AHEAD = 14;

export type BookingStep = 1 | 2 | 3 | 4;

type Loaded<T> = { key: string; value: T };

export function useBooking(
  catalog: CatalogService[],
  team: TeamMember[],
  initial: {
    serviceId?: string;
    professionalId?: string;
    date?: string;
    slotId?: string;
  },
) {
  const presetPro =
    team.find((member) => member.id === initial.professionalId) ?? null;
  // Vindo do perfil de uma profissional, só aparecem os serviços dela.
  const offered = useMemo(
    () =>
      presetPro
        ? catalog.filter((service) => presetPro.serviceIds.includes(service.id))
        : catalog,
    [catalog, presetPro],
  );
  const groups = useMemo(() => groupCatalog(offered), [offered]);
  const presetService =
    offered.find((service) => service.id === initial.serviceId) ?? null;

  const [serviceId, setServiceId] = useState(presetService?.id ?? "");
  const [chosenProId, setProfessionalId] = useState(presetPro?.id ?? "");
  const [intentId, setIntentId] = useState<string>(groups[0]?.id ?? "");
  // Vindo do agendamento rápido da home, o horário já vem escolhido.
  const quick = Boolean(presetService && initial.date && initial.slotId);
  const [date, setDate] = useState(quick ? initial.date! : "");
  const [slotId, setSlotId] = useState(quick ? initial.slotId! : "");
  const [chosenStep, setStep] = useState<BookingStep>(
    quick ? 4 : presetService ? 2 : 1,
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<null | {
    appointmentId: string;
    startsAt: string;
  }>(null);
  const [finished, setFinished] = useState<null | "paid" | "later">(null);
  const [openDates, setOpenDates] = useState<Loaded<Set<string> | null>>({
    key: "",
    value: null,
  });
  const [slots, setSlots] = useState<Loaded<Slot[]>>({ key: "", value: [] });
  const [slotsVersion, setSlotsVersion] = useState(0);

  const today = todayKey();
  const days = useMemo(() => buildDays(today, DAYS_AHEAD), [today]);
  const service = catalog.find((item) => item.id === serviceId) ?? null;
  const pros = useMemo(
    () =>
      service
        ? team.filter((member) => member.serviceIds.includes(service.id))
        : [],
    [service, team],
  );
  // Só uma profissional faz o serviço: ela já vem escolhida e o passo 2 some.
  const onlyPro = pros.length === 1 ? pros[0] : null;
  const professionalId = onlyPro?.id ?? chosenProId;
  const step: BookingStep = chosenStep === 2 && onlyPro ? 3 : chosenStep;
  const professional =
    team.find((member) => member.id === professionalId) ?? null;

  useEffect(() => {
    if (!professionalId) return;
    let active = true;
    fetchOpenDates(professionalId, today, DAYS_AHEAD)
      .catch(() => null)
      .then((value) => {
        if (!active) return;
        setOpenDates({ key: professionalId, value });
        const first = days.find(
          (day) => !day.closed && (!value || value.has(day.key)),
        );
        setDate((current) =>
          current && value?.has(current) ? current : (first?.key ?? ""),
        );
      });
    return () => {
      active = false;
    };
  }, [professionalId, today, days]);

  const slotsKey =
    professionalId && date && serviceId
      ? `${professionalId}|${date}|${serviceId}|${slotsVersion}`
      : "";
  useEffect(() => {
    if (!slotsKey) return;
    let active = true;
    fetchSlots(professionalId, date, serviceId)
      .catch((): Slot[] => [])
      .then((value) => {
        if (active) setSlots({ key: slotsKey, value });
      });
    return () => {
      active = false;
    };
  }, [slotsKey, professionalId, date, serviceId]);

  const slotList = slots.key === slotsKey ? slots.value : [];
  const nextDay =
    days.find(
      (day) =>
        day.key > date &&
        !day.closed &&
        (!openDates.value || openDates.value.has(day.key)),
    ) ?? null;
  const slot = slotList.find((item) => item.id === slotId) ?? null;
  const available = openDates.key === professionalId ? openDates.value : null;

  const chooseService = (id: string) => {
    setServiceId(id);
    setSlotId("");
    setError("");
    if (presetPro) {
      setStep(3);
      return;
    }
    const offeredBy = team.filter((member) => member.serviceIds.includes(id));
    if (!offeredBy.some((member) => member.id === chosenProId))
      setProfessionalId("");
    setStep(offeredBy.length === 1 ? 3 : 2);
  };

  const chooseProfessional = (id: string) => {
    setProfessionalId(id);
    setSlotId("");
    setStep(3);
  };

  const chooseDate = (key: string) => {
    setDate(key);
    setSlotId("");
  };

  const chooseSlot = (id: string) => {
    setSlotId(id);
    setStep(4);
  };

  const goTo = (target: BookingStep) => {
    if (
      target === 1 ||
      (target === 2 && serviceId) ||
      (target === 3 && professionalId) ||
      (target === 4 && slotId)
    ) {
      setStep(target);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const invalid = validateContact({ name, phone, email });
    if (invalid) return setError(invalid);
    if (!slot || !service || !professional)
      return setError("Escolha o serviço, o dia e o horário.");

    setSubmitting(true);
    try {
      const appointment = await book({
        name,
        phone,
        email,
        professionalId,
        serviceId,
        slotId,
      });
      setBooked({ appointmentId: appointment.id, startsAt: slot.startsAt });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // Outra cliente pode ter pego o horário entre a escolha e o envio.
      setError(
        apiErrorMessage(
          err,
          "Esse horário acabou de ser ocupado. Escolha outro.",
        ),
      );
      setSlotId("");
      setStep(3);
      setSlotsVersion((version) => version + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    goTo,
    groups,
    intentId: groups.some((group) => group.id === intentId)
      ? intentId
      : (groups[0]?.id ?? ""),
    setIntentId,
    service,
    chooseService,
    pros,
    lockedPro: Boolean(presetPro) || Boolean(onlyPro),
    professional,
    chooseProfessional,
    days,
    date,
    available,
    chooseDate,
    slots: slotList,
    loadingSlots: Boolean(slotsKey) && slots.key !== slotsKey,
    nextDay,
    slot,
    chooseSlot,
    name,
    setName,
    phone,
    setPhone: (value: string) => setPhone(maskPhone(value)),
    email,
    setEmail,
    error,
    submitting,
    booked,
    finished,
    finish: (how: "paid" | "later") => {
      setFinished(how);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    submit,
  };
}
