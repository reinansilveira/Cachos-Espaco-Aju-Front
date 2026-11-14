import Link from "next/link";
import { INSTAGRAM, NAV, TEAM_EXTRA, VISIT, WHATSAPP } from "../salon.data";
import { whatsappLink } from "../salon.utils";
import { Logo } from "./Logo";
import { Blob, WaveEdge } from "./Shapes";

export function SalonFooter() {
  return (
    <footer className="s-footer">
      <WaveEdge className="s-footer__edge" />
      <Blob variant="curl" className="s-footer__curl" />
      <Blob variant="pebble" className="s-footer__pebble" />
      <div className="s-footer__cta" data-reveal>
        <h2 className="s-title">
          Seus cachos merecem <em>esse carinho.</em>
        </h2>
        <div className="s-footer__cta-actions">
          <Link
            href="/agendar"
            prefetch={false}
            className="s-btn s-btn--gold s-btn--lg"
          >
            Agendar horário <span aria-hidden="true">→</span>
          </Link>
          <a
            href={whatsappLink(
              WHATSAPP,
              "Oi! Queria tirar uma dúvida sobre os serviços do Cachos Aju 🤎",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn s-btn--ghost s-btn--lg"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="s-footer__grid">
        <div className="s-footer__brand">
          <Logo size="lg" />
          <p>Cachos, ondas e crespos 🤎</p>
        </div>
        <nav aria-label="Rodapé" className="s-footer__col">
          <strong>Navegue</strong>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/login">Minha conta</a>
        </nav>
        <div className="s-footer__col">
          <strong>Endereço</strong>
          <span>{VISIT.street}</span>
          <span>{VISIT.district}</span>
          {VISIT.hours.map((row) => (
            <span key={row.label}>
              {row.label}: {row.time}
            </span>
          ))}
        </div>
        <div className="s-footer__col">
          <strong>Fale com a gente</strong>
          {Object.entries(TEAM_EXTRA).map(([name, contact]) => (
            <a
              key={name}
              href={whatsappLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {name}
            </a>
          ))}
          <a
            href={`https://www.instagram.com/${INSTAGRAM}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram @{INSTAGRAM}
          </a>
        </div>
      </div>

      <div className="s-footer__bottom">
        <span>© 2026 Espaço Cachos Aju</span>
        <span>
          <Link href="/termos">Termos</Link> ·{" "}
          <Link href="/privacidade">Privacidade</Link>
        </span>
      </div>
    </footer>
  );
}
