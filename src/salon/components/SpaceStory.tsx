import Image from "next/image";
import { PHOTOS, SPACE } from "../salon.data";
import { Blob } from "./Shapes";

export function SpaceStory() {
  return (
    <section className="s-space" id="espaco">
      <Blob variant="wave" className="s-space__blob" />
      <header className="s-head" data-reveal>
        <p className="s-eyebrow">O espaço</p>
        <h2 className="s-title">
          Pequeno, iluminado e <em>feito pra você.</em>
        </h2>
        <p className="s-head__text">
          Um primeiro andar no Centro, pensado em cada detalhe para você se
          sentir em casa, da chegada até o resultado final.
        </p>
      </header>

      <div className="s-space__grid">
        <figure className="s-space__lead" data-reveal>
          <Image
            src={PHOTOS.facade}
            alt="Fachada do salão com o letreiro Cachos Aju"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </figure>
        {SPACE.map((item) => (
          <figure key={item.title} className="s-space__item" data-reveal>
            <div className="s-space__photo">
              <Image
                src={item.photo}
                alt={item.text}
                fill
                sizes="(max-width: 900px) 80vw, 25vw"
              />
            </div>
            <figcaption>
              <strong>{item.title}</strong>
              {item.text}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
