"use client";

import Link from "next/link";
import { WHATSAPP } from "../salon.data";
import { whatsappLink } from "../salon.utils";
import { cn } from "@/utils/class-names";
import { useVisible } from "../hooks/use-visible";

// No celular, agendar e WhatsApp ficam sempre ao alcance do polegar.
export function FloatingBook({
  showBook = true,
  bookHref = "/agendar",
}: {
  showBook?: boolean;
  bookHref?: string;
}) {
  // Com a agenda do hero na tela, o botão flutuante só atrapalharia.
  const bookingOnScreen = useVisible(
    bookHref.startsWith("#") ? bookHref.slice(1) : null,
  );

  return (
    <div className="s-float">
      <a
        className="s-float__whats"
        href={whatsappLink(
          WHATSAPP,
          "Oi! Quero agendar um horário no Cachos Aju 🤎",
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp (abre em nova aba)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z"
          />
        </svg>
      </a>
      {showBook && (
        <Link
          href="/agendar"
          prefetch={false}
          className={cn(
            "s-float__book s-btn s-btn--gold",
            bookingOnScreen && "s-float__book--hidden",
          )}
        >
          Agendar horário
        </Link>
      )}
    </div>
  );
}
