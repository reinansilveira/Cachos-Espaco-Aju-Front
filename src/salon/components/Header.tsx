"use client";

import Link from "next/link";
import { cn } from "@/utils/class-names";
import { NAV } from "../salon.data";
import { useHeader } from "../hooks/use-header";
import { Logo } from "./Logo";

export function Header({
  tone = "dark",
  bookHref = "/agendar",
}: {
  tone?: "dark" | "light";
  bookHref?: string;
}) {
  const header = useHeader();

  return (
    <header
      className={cn(
        "s-header",
        `s-header--${tone}`,
        header.scrolled && "s-header--solid",
        header.open && "s-header--open",
      )}
    >
      <Logo size="sm" withName />

      <nav className="s-header__nav" id="menu-site" aria-label="Principal">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="s-header__link"
            onClick={header.close}
          >
            {item.label}
          </a>
        ))}
        <a
          href="/login"
          className="s-header__link s-header__link--account"
          onClick={header.close}
        >
          Minha conta
        </a>
      </nav>

      <div className="s-header__actions">
        <a href="/login" className="s-header__login">
          Entrar
        </a>
        <Link
          href={bookHref}
          prefetch={false}
          className="s-btn s-btn--gold s-btn--sm"
        >
          Agendar
        </Link>
        <button
          type="button"
          className="s-header__burger"
          aria-expanded={header.open}
          aria-controls="menu-site"
          aria-label={header.open ? "Fechar menu" : "Abrir menu"}
          onClick={header.toggle}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
