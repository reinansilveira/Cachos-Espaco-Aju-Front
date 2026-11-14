import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/class-names";
import { useEscapeKey } from "./use-escape-key";
import "./PanelDialog.scss";

// Modal do painel (estoque e comanda): fecha no X, no Esc e clicando fora.
export function PanelDialog({
  title,
  eyebrow,
  onClose,
  children,
  wide,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useEscapeKey(onClose);

  return (
    <div
      ref={ref}
      className="panel-dialog"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={cn("panel-dialog__box", wide && "panel-dialog__box--wide")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="panel-dialog__header">
          <div>
            {eyebrow && <p className="panel-dialog__eyebrow">{eyebrow}</p>}
            <h2 className="panel-dialog__title">{title}</h2>
          </div>
          <button
            type="button"
            className="panel-dialog__close"
            onClick={onClose}
            aria-label="Fechar"
            autoFocus
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="panel-dialog__body">{children}</div>
      </div>
    </div>
  );
}
