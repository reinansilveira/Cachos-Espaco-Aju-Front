"use client";

import { useEffect, useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import { depositStatus, startDeposit, type DepositPayment } from "../salon.api";

const POLL_MS = 4000;

function cpfMask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function useDeposit(appointmentId: string, onPaid: () => void) {
  const [method, setMethod] = useState<"PIX" | "CREDIT_CARD">("PIX");
  const [cpf, setCpf] = useState("");
  const [payment, setPayment] = useState<DepositPayment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Enquanto a cobrança está aberta, confere se já caiu.
  useEffect(() => {
    if (!payment || payment.status !== "PENDING") return;
    const timer = setInterval(() => {
      void depositStatus(appointmentId, payment.id)
        .then((current) => {
          if (current.status === "PAID") onPaid();
          else if (current.status !== "PENDING") {
            setPayment(null);
            setError("O pagamento não foi concluído. Gere outro.");
          }
        })
        .catch(() => undefined);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [appointmentId, payment, onPaid]);

  const submit = async () => {
    setError("");
    if (cpf.replace(/\D/g, "").length !== 11)
      return setError("Informe o CPF completo.");
    setSubmitting(true);
    try {
      setPayment(await startDeposit(appointmentId, { cpfCnpj: cpf, method }));
    } catch (err) {
      setError(
        apiErrorMessage(
          err,
          "Não foi possível gerar o pagamento. Tente de novo.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return {
    method,
    setMethod: (value: "PIX" | "CREDIT_CARD") => {
      setMethod(value);
      setPayment(null);
    },
    cpf,
    setCpf: (value: string) => setCpf(cpfMask(value)),
    payment,
    submitting,
    error,
    submit,
    copied,
    copy,
  };
}
