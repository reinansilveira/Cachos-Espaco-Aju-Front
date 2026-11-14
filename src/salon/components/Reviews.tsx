import { GOOGLE, REVIEWS } from "../salon.data";
import { Blob, WaveEdge } from "./Shapes";
import { Stars } from "./Stars";

export function Reviews() {
  return (
    <section className="s-reviews" id="avaliacoes">
      <WaveEdge className="s-reviews__edge" />
      <Blob variant="curl" className="s-reviews__curl" />
      <div className="s-reviews__score" data-reveal>
        <p className="s-eyebrow">No Google</p>
        <strong>5,0</strong>
        <Stars className="s-stars s-stars--lg" />
        <p>{GOOGLE.count} avaliações, todas com cinco estrelas.</p>
        <a
          href={GOOGLE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="s-link"
        >
          Ver no Google Maps ↗
        </a>
      </div>

      <ul className="s-reviews__list" aria-label="O que as clientes dizem">
        {REVIEWS.map((review) => (
          <li key={review.client} className="s-quote" data-reveal>
            <Stars className="s-stars" />
            <blockquote>“{review.text}”</blockquote>
            <p>
              <strong>{review.client}</strong> · {review.when}
            </p>
          </li>
        ))}
      </ul>
      <WaveEdge className="s-reviews__edge s-reviews__edge--bottom" />
    </section>
  );
}
