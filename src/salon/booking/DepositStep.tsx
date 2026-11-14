"use client";

import { cn } from "@/utils/class-names";
import { money } from "../salon.utils";
import { CurlMark } from "../components/Shapes";
import { useDeposit } from "./use-deposit";

export function DepositStep({
  appointmentId,
  amount,
  total,
  summary,
  onPaid,
  onLater,
}: {
  appointmentId: string;
  amount: number;
  total: number;
  summary: string;
  onPaid: () => void;
  onLater: () => void;
}) {
  const deposit = useDeposit(appointmentId, onPaid);
  const payment = deposit.payment;

  return (
    <div className="s-deposit">
      <CurlMark className="s-done__mark" />
      <p className="s-eyebrow">Último passo</p>
      <h1 className="s-title">
        Garanta seu horário com <em>o sinal.</em>
      </h1>
      <p className="s-deposit__lead">
        {summary}. O sinal de <strong>{money(amount)}</strong> (20%) confirma o
        horário e é descontado no dia: no salão você paga só{" "}
        {money(total - amount)}.
      </p>

      <div className="s-deposit__card">
        <div
          className="s-deposit__methods"
          role="radiogroup"
          aria-label="Forma de pagamento"
        >
          {(["PIX", "CREDIT_CARD"] as const).map((method) => (
            <button
              key={method}
              type="button"
              role="radio"
              aria-checked={deposit.method === method}
              className={cn(
                "s-pill",
                deposit.method === method && "s-pill--active",
              )}
              onClick={() => deposit.setMethod(method)}
            >
              {method === "PIX" ? "Pix" : "Cartão de crédito"}
            </button>
          ))}
        </div>

        {!payment ? (
          <div className="s-form">
            <label className="s-form__wide">
              CPF de quem vai pagar
              <input
                value={deposit.cpf}
                onChange={(event) => deposit.setCpf(event.target.value)}
                inputMode="numeric"
                placeholder="000.000.000-00"
              />
            </label>
            <button
              type="button"
              className="s-btn s-btn--gold s-btn--lg s-form__wide"
              onClick={deposit.submit}
              disabled={deposit.submitting}
            >
              {deposit.submitting
                ? "Gerando…"
                : deposit.method === "PIX"
                  ? `Gerar Pix de ${money(amount)}`
                  : `Pagar ${money(amount)} no cartão`}
            </button>
          </div>
        ) : deposit.method === "PIX" ? (
          <div className="s-deposit__pay">
            {payment.pixQrCodeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="s-deposit__qr"
                src={`data:image/png;base64,${payment.pixQrCodeImage}`}
                alt="QR Code do Pix"
              />
            ) : null}
            {payment.pixPayload && (
              <>
                <code>{payment.pixPayload}</code>
                <button
                  type="button"
                  className="s-btn s-btn--dark"
                  onClick={() => deposit.copy(payment.pixPayload!)}
                >
                  {deposit.copied ? "Código copiado!" : "Copiar código Pix"}
                </button>
              </>
            )}
            <p className="s-deposit__wait">
              <i aria-hidden="true" /> Aguardando o pagamento. Assim que cair,
              seu horário é confirmado aqui.
            </p>
          </div>
        ) : (
          <div className="s-deposit__pay">
            {payment.invoiceUrl && (
              <a
                className="s-btn s-btn--gold s-btn--lg"
                href={payment.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir pagamento com cartão ↗
              </a>
            )}
            <p className="s-deposit__wait">
              <i aria-hidden="true" /> Pague na página do Asaas. Esta tela
              confirma sozinha quando o pagamento for aprovado.
            </p>
          </div>
        )}

        {deposit.error && (
          <p className="s-error" role="alert">
            {deposit.error}
          </p>
        )}
      </div>

      <button type="button" className="s-link" onClick={onLater}>
        Prefiro combinar o sinal pelo WhatsApp
      </button>
    </div>
  );
}
