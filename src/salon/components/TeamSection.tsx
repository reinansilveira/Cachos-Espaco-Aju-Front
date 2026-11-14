import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "../salon.types";
import { whatsappLink } from "../salon.utils";
import { CurlMark } from "./Shapes";

export function TeamSection({ team }: { team: TeamMember[] }) {
  if (!team.length) return null;

  return (
    <section className="s-team" id="equipe">
      <header className="s-head" data-reveal>
        <p className="s-eyebrow">Equipe</p>
        <h2 className="s-title">
          Mãos que entendem <em>de curvatura.</em>
        </h2>
      </header>

      <div className="s-team__grid">
        {team.map((member) => (
          <article key={member.id} className="s-member" data-reveal>
            <div className="s-member__portrait">
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  sizes="160px"
                />
              ) : (
                <span aria-hidden="true">
                  <CurlMark />
                  {member.firstName.charAt(0)}
                </span>
              )}
            </div>
            <div className="s-member__copy">
              <h3>{member.name}</h3>
              <p className="s-member__role">{member.role}</p>
              {member.bio && <p className="s-member__bio">{member.bio}</p>}
              <div className="s-member__actions">
                <Link
                  href={`/agendar?profissional=${member.id}`}
                  prefetch={false}
                  className="s-btn s-btn--gold s-btn--sm"
                >
                  Agendar com {member.firstName}
                </Link>
                {member.instagram && (
                  <a
                    href={`https://www.instagram.com/${member.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s-link"
                  >
                    @{member.instagram}
                  </a>
                )}
                {member.whatsapp && (
                  <a
                    href={whatsappLink(
                      member.whatsapp,
                      `Oi, ${member.firstName}! Vim pelo site do Cachos Aju 🤎`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s-link"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
