"use client";

import { Plus, ReceiptText, Search } from "lucide-react";
import type { Order } from "@/services/order";
import { cn } from "@/utils/class-names";
import { currency } from "@/utils/format";
import { OrderDetail } from "./OrderDetail";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  productUnits,
} from "./orders.utils";
import { useOrdersPanel } from "./use-orders-panel";
import "./Orders.scss";

const time = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function OrderCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const units = productUnits(order);
  return (
    <button type="button" className="order-card" onClick={onOpen}>
      <span className="order-card__top">
        <b>#{order.number}</b>
        <span
          className={cn(
            "order-status",
            `order-status--${ORDER_STATUS_TONE[order.status]}`,
          )}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </span>
      <span className="order-card__client">
        {order.client?.name ?? "Sem cliente"}
      </span>
      <span className="order-card__meta">
        {order.appointment?.serviceName ?? "Comanda avulsa"}
        {units > 0 && ` · ${units} ${units === 1 ? "produto" : "produtos"}`}
      </span>
      <span className="order-card__bottom">
        <small>{time.format(new Date(order.paidAt ?? order.createdAt))}</small>
        <b>{currency.format(order.total)}</b>
      </span>
    </button>
  );
}

export function OrdersPanel() {
  const panel = useOrdersPanel();
  const columns = [
    { id: "open", title: "Abertas", orders: panel.groups.open },
    {
      id: "waiting",
      title: "Aguardando pagamento",
      orders: panel.groups.waiting,
    },
    {
      id: "done",
      title: "Finalizadas",
      orders: panel.groups.done.slice(0, 20),
    },
  ];

  return (
    <div className="orders-panel">
      <header className="panel-head">
        <div>
          <p className="panel-head__eyebrow">Caixa</p>
          <h1 className="panel-head__title">Comandas</h1>
          <p className="panel-head__subtitle">
            Serviço e produtos na mesma conta. Pix com QR, cartão ou dinheiro.
          </p>
        </div>
        <button
          type="button"
          className="panel-button"
          onClick={panel.newOrder}
          disabled={panel.creating}
        >
          <Plus aria-hidden="true" /> Nova comanda
        </button>
      </header>

      <section className="panel-stats" aria-label="Hoje">
        <article className="panel-stat">
          <ReceiptText aria-hidden="true" />
          <span>Abertas agora</span>
          <b>{panel.groups.open.length + panel.groups.waiting.length}</b>
        </article>
        <article className="panel-stat">
          <span>Recebido hoje</span>
          <b>{currency.format(panel.today.revenue)}</b>
        </article>
        <article className="panel-stat">
          <span>Comandas pagas hoje</span>
          <b>{panel.today.count}</b>
        </article>
        <article className="panel-stat">
          <span>Produtos vendidos hoje</span>
          <b>{panel.today.products}</b>
        </article>
      </section>

      <div className="panel-toolbar">
        <label className="panel-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Buscar comanda</span>
          <input
            value={panel.search}
            onChange={(event) => panel.setSearch(event.target.value)}
            placeholder="Cliente ou número da comanda"
          />
        </label>
      </div>

      {panel.groups.upcoming.length > 0 && (
        <p className="orders-panel__upcoming">
          {panel.groups.upcoming.length}{" "}
          {panel.groups.upcoming.length === 1
            ? "horário futuro com sinal"
            : "horários futuros com sinal"}{" "}
          pelo site. A comanda aparece aqui no dia do atendimento.
        </p>
      )}

      {panel.error && (
        <p className="panel-form__error" role="alert">
          {panel.error}
        </p>
      )}

      {panel.loading ? (
        <p className="panel-empty">Carregando comandas…</p>
      ) : (
        <div className="orders-board">
          {columns.map((column) => (
            <section key={column.id} className="orders-board__column">
              <h2 className="orders-board__title">
                {column.title} <span>{column.orders.length}</span>
              </h2>
              {column.orders.length === 0 ? (
                <p className="orders-board__empty">Nada por aqui.</p>
              ) : (
                column.orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOpen={() => panel.open(order.id)}
                  />
                ))
              )}
            </section>
          ))}
        </div>
      )}

      {panel.selectedId && (
        <OrderDetail
          key={panel.selectedId}
          orderId={panel.selectedId}
          onClose={panel.closeDetail}
          onChanged={panel.reload}
        />
      )}
    </div>
  );
}
