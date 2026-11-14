"use client";

import {
  AlertTriangle,
  ArrowDownUp,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { currency } from "@/utils/format";
import { cn } from "@/utils/class-names";
import { ProductFormModal } from "./ProductFormModal";
import { StockMovementModal } from "./StockMovementModal";
import {
  MOVEMENT_LABELS,
  PRODUCT_TYPE_LABELS,
  quantityText,
  type StockFilter,
} from "./stock.utils";
import { useStockPanel } from "./use-stock-panel";
import "./Stock.scss";

const FILTERS: { id: StockFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "SALE", label: "Venda" },
  { id: "INTERNAL_USE", label: "Uso interno" },
  { id: "low", label: "Estoque baixo" },
];

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function StockPanel() {
  const panel = useStockPanel();

  return (
    <div className="stock-panel">
      <header className="panel-head">
        <div>
          <p className="panel-head__eyebrow">Produtos</p>
          <h1 className="panel-head__title">Estoque</h1>
          <p className="panel-head__subtitle">
            O que vende para as clientes e o que usa no salão, com entrada e
            baixa.
          </p>
        </div>
        <button
          type="button"
          className="panel-button"
          onClick={panel.openNewProduct}
        >
          <Plus aria-hidden="true" /> Novo produto
        </button>
      </header>

      <section className="panel-stats" aria-label="Resumo do estoque">
        <article className="panel-stat">
          <ShoppingBag aria-hidden="true" />
          <span>Produtos de venda</span>
          <b>{panel.summary.sale}</b>
        </article>
        <article className="panel-stat">
          <Sparkles aria-hidden="true" />
          <span>Uso interno</span>
          <b>{panel.summary.internal}</b>
        </article>
        <article
          className={cn(
            "panel-stat",
            panel.summary.low > 0 && "panel-stat--alert",
          )}
        >
          <AlertTriangle aria-hidden="true" />
          <span>Estoque baixo</span>
          <b>{panel.summary.low}</b>
        </article>
        <article className="panel-stat">
          <PackageCheck aria-hidden="true" />
          <span>Na prateleira (venda)</span>
          <b>{currency.format(panel.summary.shelfValue)}</b>
        </article>
      </section>

      <div className="stock-panel__layout">
        <section className="panel-card">
          <div className="panel-toolbar">
            <div
              className="panel-chips"
              role="tablist"
              aria-label="Filtrar produtos"
            >
              {FILTERS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={panel.filter === id}
                  className={cn(
                    "panel-chip",
                    panel.filter === id && "panel-chip--active",
                  )}
                  onClick={() => panel.setFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="panel-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Buscar produto</span>
              <input
                value={panel.search}
                onChange={(event) => panel.setSearch(event.target.value)}
                placeholder="Buscar por nome ou marca"
              />
            </label>
          </div>

          {panel.error && (
            <p className="panel-form__error" role="alert">
              {panel.error}
            </p>
          )}

          {panel.loading ? (
            <p className="panel-empty">Carregando estoque…</p>
          ) : panel.products.length === 0 ? (
            <div className="panel-empty">
              <Package aria-hidden="true" />
              <p>Nenhum produto por aqui.</p>
              <button
                type="button"
                className="panel-button panel-button--soft"
                onClick={panel.openNewProduct}
              >
                Cadastrar o primeiro
              </button>
            </div>
          ) : (
            <ul className="stock-list">
              {panel.products.map((product) => (
                <li key={product.id} className="stock-item">
                  <div className="stock-item__main">
                    <span
                      className={cn(
                        "stock-item__type",
                        `stock-item__type--${product.type === "SALE" ? "sale" : "internal"}`,
                      )}
                    >
                      {PRODUCT_TYPE_LABELS[product.type]}
                    </span>
                    <h3 className="stock-item__name">{product.name}</h3>
                    <p className="stock-item__meta">
                      {[
                        product.brand,
                        product.salePrice !== null &&
                          currency.format(product.salePrice),
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Sem marca"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "stock-item__quantity",
                      product.lowStock && "stock-item__quantity--low",
                    )}
                  >
                    <b>{product.stockQuantity}</b>
                    <span>
                      {product.lowStock
                        ? `mín. ${product.minStock}`
                        : quantityText(
                            product.stockQuantity,
                            product.unit,
                          ).split(" ")[1]}
                    </span>
                  </div>
                  <div className="stock-item__actions">
                    <button
                      type="button"
                      className="panel-button panel-button--soft"
                      onClick={() => panel.openMovement(product)}
                    >
                      <ArrowDownUp aria-hidden="true" /> Movimentar
                    </button>
                    <button
                      type="button"
                      className="panel-icon-button"
                      onClick={() => panel.openEditProduct(product)}
                      aria-label={`Editar ${product.name}`}
                    >
                      <Pencil aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="panel-card stock-history">
          <h2 className="panel-card__title">Últimos movimentos</h2>
          {panel.movements.length === 0 ? (
            <p className="panel-empty">Nada lançado ainda.</p>
          ) : (
            <ol className="stock-history__list">
              {panel.movements.map((movement) => (
                <li key={movement.id} className="stock-history__item">
                  <span
                    className={cn(
                      "stock-history__delta",
                      movement.quantity > 0
                        ? "stock-history__delta--in"
                        : "stock-history__delta--out",
                    )}
                  >
                    {movement.quantity > 0
                      ? `+${movement.quantity}`
                      : movement.quantity}
                  </span>
                  <div>
                    <b>{movement.product?.name}</b>
                    <small>
                      {MOVEMENT_LABELS[movement.type]}
                      {movement.order && ` · comanda #${movement.order.number}`}
                      {movement.reason &&
                        !movement.order &&
                        ` · ${movement.reason}`}
                    </small>
                    <small>
                      {dateTime.format(new Date(movement.createdAt))}
                      {movement.createdBy && ` · ${movement.createdBy.name}`}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      {panel.modal?.kind === "product" && (
        <ProductFormModal
          product={panel.modal.product}
          onClose={panel.closeModal}
        />
      )}
      {panel.modal?.kind === "movement" && (
        <StockMovementModal
          product={panel.modal.product}
          onClose={panel.closeModal}
        />
      )}
    </div>
  );
}
