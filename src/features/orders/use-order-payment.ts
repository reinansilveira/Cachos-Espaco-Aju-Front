import { useEffect, useState } from "react";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  createOrderPayment,
  getOrderPix,
  refreshOrderPayment,
  type Order,
  type OrderPayment,
} from "@/services/order";
import {
  cpfMask,
  findPaymentOption,
  pendingGatewayPayment,
  type PaymentOptionId,
} from "./orders.utils";

const POLL_MS = 5000;

export function useOrderPayment(
  order: Order,
  onClose: (paid?: boolean) => void,
) {
  const resume = pendingGatewayPayment(order);
  const [optionId, setOptionId] = useState<PaymentOptionId>("pix-asaas");
  const [cpf, setCpf] = useState("");
  const [payment, setPayment] = useState<OrderPayment | null>(resume);
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const option = findPaymentOption(optionId);
  const needsCpf = option.gateway && !order.client?.hasCpf;
  const needsClient = option.gateway && !order.client;

  // Retoma o Pix já gerado (o QR em imagem não fica salvo no banco).
  useEffect(() => {
    if (!resume || resume.method !== "PIX") return;
    void getOrderPix(order.id, resume.id)
      .then(setPayment)
      .catch(() => undefined);
  }, [order.id, resume]);

  // Enquanto a cobrança do Asaas está pendente, confere se já caiu.
  useEffect(() => {
    if (!payment || payment.status !== "PENDING" || !payment.gateway) return;
    const timer = setInterval(() => {
      void refreshOrderPayment(order.id, payment.id)
        .then((updated) => {
          if (updated.status === "PAID") setPaid(true);
          else if (updated.status !== "PENDING") {
            setPayment(null);
            setError("A cobrança venceu ou foi recusada. Gere outra.");
          }
        })
        .catch(() => undefined);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [order.id, payment]);

  const submit = async () => {
    setError("");
    if (needsClient) {
      return setError("Escolha a cliente da comanda para cobrar pelo Asaas.");
    }
    setSubmitting(true);
    try {
      const created = await createOrderPayment(order.id, {
        method: option.method,
        gateway: option.gateway,
        cpfCnpj: needsCpf ? cpf : undefined,
      });
      if (created.status === "PAID") setPaid(true);
      else setPayment(created);
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível registrar o pagamento."));
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
    optionId,
    setOptionId,
    option,
    cpf,
    setCpf: (value: string) => setCpf(cpfMask(value)),
    needsCpf,
    needsClient,
    payment,
    paid,
    submitting,
    error,
    submit,
    copied,
    copy,
    changeMethod: () => setPayment(null),
    close: () => onClose(paid),
  };
}
