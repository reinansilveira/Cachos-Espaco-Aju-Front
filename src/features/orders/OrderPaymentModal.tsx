"use client";

import { CircleCheck, Copy, ExternalLink, LoaderCircle } from "lucide-react";
import { PanelDialog } from "@/components/panel-dialog/PanelDialog";
import type { Order } from "@/services/order";
import { cn } from "@/utils/class-names";
import { currency } from "@/utils/format";
import { PAYMENT_OPTIONS } from "./orders.utils";
import { useOrderPayment } from "./use-order-payment";

export function OrderPaymentModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: (paid?: boolean) => void;
}) {
  const pay = useOrderPayment(order, onClose);

  return (
    <PanelDialog
      title={`Receber ${currency.format(order.dueAmount)}`}
      eyebrow={`Comanda #${order.number}`}
      onClose={pay.close}
    >
      {pay.paid ? (
        <div className="order-pay__done" role="status">
          <CircleCheck aria-hidden="true" />
          <h3>Pagamento confirmado!</h3>
          <p>A comanda foi quitada e os produtos já saíram do estoque.</p>
          <button type="button" className="panel-button" onClick={pay.close}>
            Concluir
          </button>
        </div>
      ) : pay.payment ? (
        <div className="order-pay__waiting">
          {pay.payment.method === "PIX" ? (
            <>
              {pay.payment.pixQrCodeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="order-pay__qr"
                  src={`data:image/png;base64,${pay.payment.pixQrCodeImage}`}
                  alt="QR Code do Pix"
                />
              ) : (
                <p className="order-pay__hint">
                  QR em preparo. Use o código copia e cola abaixo.
                </p>
              )}
              {pay.payment.pixPayload && (
                <div className="order-pay__code">
                  <code>{pay.payment.pixPayload}</code>
                  <button
                    type="button"
                    className="panel-button panel-button--soft"
                    onClick={() => pay.copy(pay.payment!.pixPayload!)}
                  >
                    <Copy aria-hidden="true" />
                    {pay.copied ? "Copiado!" : "Copiar código"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="order-pay__code">
              <p className="order-pay__hint">
                Envie este link para a cliente pagar no cartão de crédito.
              </p>
              {pay.payment.invoiceUrl && (
                <div className="order-pay__links">
                  <button
                    type="button"
                    className="panel-button panel-button--soft"
                    onClick={() => pay.copy(pay.payment!.invoiceUrl!)}
                  >
                    <Copy aria-hidden="true" />
                    {pay.copied ? "Copiado!" : "Copiar link"}
                  </button>
                  <a
                    className="panel-button panel-button--soft"
                    href={pay.payment.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink aria-hidden="true" /> Abrir
                  </a>
                </div>
              )}
            </div>
          )}
          <p className="order-pay__status" role="status">
            <LoaderCircle aria-hidden="true" /> Aguardando o pagamento cair…
          </p>
          {pay.error && (
            <p className="panel-form__error" role="alert">
              {pay.error}
            </p>
          )}
          <button
            type="button"
            className="order-pay__switch"
            onClick={pay.changeMethod}
          >
            Trocar forma de pagamento
          </button>
        </div>
      ) : (
        <div className="order-pay">
          <div
            className="order-pay__options"
            role="radiogroup"
            aria-label="Forma de pagamento"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={pay.optionId === option.id}
                className={cn(
                  "order-pay__option",
                  pay.optionId === option.id && "order-pay__option--selected",
                )}
                onClick={() => pay.setOptionId(option.id)}
              >
                <b>{option.title}</b>
                <small>{option.hint}</small>
                {option.gateway && (
                  <span className="order-pay__tag">Asaas</span>
                )}
              </button>
            ))}
          </div>

          {pay.needsClient && (
            <p className="order-pay__hint">
              Para cobrar pelo Asaas, escolha a cliente na comanda.
            </p>
          )}
          {pay.needsCpf && !pay.needsClient && (
            <label className="panel-form__field">
              CPF da cliente (só na primeira cobrança)
              <input
                inputMode="numeric"
                value={pay.cpf}
                onChange={(event) => pay.setCpf(event.target.value)}
                placeholder="000.000.000-00"
              />
            </label>
          )}

          {pay.error && (
            <p className="panel-form__error" role="alert">
              {pay.error}
            </p>
          )}

          <button
            type="button"
            className="panel-button panel-button--gold order-pay__submit"
            onClick={pay.submit}
            disabled={pay.submitting}
          >
            {pay.submitting
              ? "Enviando…"
              : pay.option.gateway
                ? pay.option.method === "PIX"
                  ? "Gerar Pix"
                  : "Gerar link de cartão"
                : `Registrar ${currency.format(order.dueAmount)} recebido`}
          </button>
        </div>
      )}
    </PanelDialog>
  );
}
