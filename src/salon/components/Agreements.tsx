import { AGREEMENTS } from "../salon.data";

export function Agreements() {
  return (
    <section className="s-faq" id="combinados">
      <header className="s-head" data-reveal>
        <p className="s-eyebrow">Antes de vir</p>
        <h2 className="s-title">
          Nossos <em>combinados.</em>
        </h2>
      </header>
      <div className="s-faq__list">
        {AGREEMENTS.map((item, index) => (
          <details
            key={item.q}
            className="s-faq__item"
            open={index === 0}
            data-reveal
          >
            <summary>
              {item.q}
              <span aria-hidden="true" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
