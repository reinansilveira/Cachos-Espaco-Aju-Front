"use client";

import { Minus, Plus, Search, Trash2, UserRound } from "lucide-react";
import { PanelDialog } from "@/components/panel-dialog/PanelDialog";
import { cn } from "@/utils/class-names";
import { currency } from "@/utils/format";
import { OrderPaymentModal } from "./OrderPaymentModal";
import {
  METHOD_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  paidDeposit,
} from "./orders.utils";
import { useOrderDetail } from "./use-order-detail";

export function OrderDetail({
  orderId,
  onClose,
  onChanged,
}: {
  orderId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const detail = useOrderDetail(orderId, onChanged);
  const order = detail.order;
  const editable = order?.status === "OPEN";

  return (
    <PanelDialog
      wide
      title={order ? `Comanda #${order.number}` : "Comanda"}
      eyebrow={order ? ORDER_STATUS_LABELS[order.status] : "Carregando"}
      onClose={onClose}
    >
      {!order ? (
        <p className="panel-empty">{detail.error || "Carregando comanda…"}</p>
      ) : (
        <div className="order-detail">
          <section className="order-detail__main">
            <div className="order-detail__client">
              <UserRound aria-hidden="true" />
              {order.client ? (
                <div>
                  <b>{order.client.name}</b>
                  <small>
                    {order.appointment
                      ? `Atendimento: ${order.appointment.serviceName}`
                      : "Comanda avulsa"}
                  </small>
                </div>
              ) : (
                <div className="order-detail__client-search">
                  <label className="panel-search">
                    <Search aria-hidden="true" />
                    <span className="sr-only">Buscar cliente</span>
                    <input
                      value={detail.clientQuery}
                      onChange={(event) =>
                        detail.setClientQuery(event.target.value)
                      }
                      placeholder="Cliente (nome ou telefone) — opcional"
                      disabled={
                        !editable && order.status !== "AWAITING_PAYMENT"
                      }
                    />
                  </label>
                  {detail.clientOptions.length > 0 && (
                    <ul className="order-detail__options">
                      {detail.clientOptions.map((client) => (
                        <li key={client.id}>
                          <button
                            type="button"
                            onClick={() => detail.chooseClient(client)}
                          >
                            <b>{client.name}</b>
                            <small>{client.phone ?? "sem telefone"}</small>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <ul className="order-items">
              {order.items.length === 0 && (
                <li className="panel-empty">
                  Adicione o serviço e os produtos que a cliente vai levar.
                </li>
              )}
              {order.items.map((item) => (
                <li key={item.id} className="order-items__row">
                  <span
                    className={cn(
                      "order-items__kind",
                      `order-items__kind--${item.type === "SERVICE" ? "service" : "product"}`,
                    )}
                  >
                    {item.type === "SERVICE" ? "Serviço" : "Produto"}
                  </span>
                  <div className="order-items__info">
                    <b>{item.description}</b>
                    <small>
                      {currency.format(item.unitPrice)}
                      {item.professional && ` · ${item.professional.name}`}
                    </small>
                  </div>
                  <div className="order-items__qty">
                    {editable && item.type === "PRODUCT" ? (
                      <>
                        <button
                          type="button"
                          className="panel-icon-button"
                          onClick={() =>
                            detail.changeQuantity(item.id, item.quantity - 1)
                          }
                          disabled={detail.busy}
                          aria-label={`Diminuir ${item.description}`}
                        >
                          <Minus aria-hidden="true" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          className="panel-icon-button"
                          onClick={() =>
                            detail.changeQuantity(item.id, item.quantity + 1)
                          }
                          disabled={detail.busy}
                          aria-label={`Aumentar ${item.description}`}
                        >
                          <Plus aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <span>{item.quantity}×</span>
                    )}
                  </div>
                  <b className="order-items__total">
                    {currency.format(item.total)}
                  </b>
                  {editable && (
                    <button
                      type="button"
                      className="panel-icon-button"
                      onClick={() => detail.removeItem(item.id)}
                      disabled={detail.busy}
                      aria-label={`Remover ${item.description}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {editable && (
              <div className="order-add">
                <div className="order-add__head">
                  <h3>Produtos para levar</h3>
                  <label className="panel-search">
                    <Search aria-hidden="true" />
                    <span className="sr-only">Buscar produto</span>
                    <input
                      value={detail.productQuery}
                      onChange={(event) =>
                        detail.setProductQuery(event.target.value)
                      }
                      placeholder="Buscar produto"
                    />
                  </label>
                </div>
                <ul className="order-add__grid">
                  {detail.products.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        className="order-add__product"
                        onClick={() => detail.addProduct(product.id)}
                        disabled={detail.busy || product.stockQuantity === 0}
                      >
                        <b>{product.name}</b>
                        <small>
                          {currency.format(product.salePrice ?? 0)} ·{" "}
                          {product.stockQuantity === 0
                            ? "sem estoque"
                            : `${product.stockQuantity} em estoque`}
                        </small>
                        <Plus aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                  {detail.products.length === 0 && (
                    <li className="order-add__empty">
                      Nenhum produto de venda cadastrado.
                    </li>
                  )}
                </ul>

                <label className="panel-form__field order-add__service">
                  Adicionar serviço
                  <select
                    value=""
                    onChange={(event) => detail.addService(event.target.value)}
                    disabled={detail.busy}
                  >
                    <option value="">Escolha um serviço…</option>
                    {detail.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ·{" "}
                        {currency.format(Number(service.price))}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </section>

          <aside className="order-summary">
            <span
              className={cn(
                "order-status",
                `order-status--${ORDER_STATUS_TONE[order.status]}`,
              )}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <dl className="order-summary__lines">
              <div>
                <dt>Subtotal</dt>
                <dd>{currency.format(order.subtotal)}</dd>
              </div>
              <div>
                <dt>Desconto</dt>
                <dd>
                  {editable ? (
                    <span className="order-summary__discount">
                      <input
                        inputMode="decimal"
                        value={detail.discount}
                        onChange={(event) =>
                          detail.setDiscount(event.target.value)
                        }
                        onBlur={detail.applyDiscount}
                        placeholder="0,00"
                        aria-label="Desconto em reais"
                      />
                    </span>
                  ) : (
                    `− ${currency.format(order.discount)}`
                  )}
                </dd>
              </div>
              <div className="order-summary__total">
                <dt>Total</dt>
                <dd>{currency.format(order.total)}</dd>
              </div>
              {order.paidAmount > 0 && (
                <>
                  <div>
                    <dt>
                      {paidDeposit(order) ? "Sinal pago no site" : "Já pago"}
                    </dt>
                    <dd>− {currency.format(order.paidAmount)}</dd>
                  </div>
                  <div className="order-summary__due">
                    <dt>A receber</dt>
                    <dd>{currency.format(order.dueAmount)}</dd>
                  </div>
                </>
              )}
            </dl>

            {order.payments
              .filter((payment) => payment.status === "PAID")
              .map((payment) => (
                <p key={payment.id} className="order-summary__paid">
                  {payment.isDeposit ? "Sinal" : "Pago"} no{" "}
                  {METHOD_LABELS[payment.method]}
                  {payment.gateway ? " (Asaas)" : ""} ·{" "}
                  {currency.format(payment.amount)}
                </p>
              ))}

            {detail.error && (
              <p className="panel-form__error" role="alert">
                {detail.error}
              </p>
            )}

            <div className="order-summary__actions">
              {order.status === "OPEN" && (
                <button
                  type="button"
                  className="panel-button panel-button--gold"
                  onClick={detail.close}
                  disabled={detail.busy || order.items.length === 0}
                >
                  Fechar e receber
                </button>
              )}
              {order.status === "AWAITING_PAYMENT" && (
                <>
                  <button
                    type="button"
                    className="panel-button panel-button--gold"
                    onClick={detail.openPayment}
                  >
                    Receber pagamento
                  </button>
                  <button
                    type="button"
                    className="panel-button panel-button--soft"
                    onClick={detail.reopen}
                    disabled={detail.busy}
                  >
                    Reabrir para editar
                  </button>
                </>
              )}
              {(order.status === "OPEN" ||
                order.status === "AWAITING_PAYMENT") && (
                <button
                  type="button"
                  className="panel-button panel-button--ghost-danger"
                  onClick={detail.cancel}
                  disabled={detail.busy}
                >
                  Cancelar comanda
                </button>
              )}
            </div>
            <p className="order-summary__note">
              Ao fechar, os produtos saem do estoque. Reabrir ou cancelar
              devolve.
            </p>
          </aside>
        </div>
      )}

      {order && detail.paying && (
        <OrderPaymentModal order={order} onClose={detail.closePayment} />
      )}
    </PanelDialog>
  );
}
