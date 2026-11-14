import { useEffect, useRef } from "react";

// Esc fecha o modal mesmo com o foco fora dele (ex.: depois de um clique).
// Com modais empilhados (comanda > pagamento), só o de cima fecha.
export function useEscapeKey(onEscape: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const dialogs = document.querySelectorAll(".panel-dialog");
      if (dialogs[dialogs.length - 1] === ref.current) onEscape();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onEscape]);

  return ref;
}
