import Image from "next/image";
import { cn } from "@/utils/class-names";
import "./SalonArt.scss";

type SalonArtProps = {
  image?: string | null;
  video?: string | null;
  alt?: string;
  // Texto da arte quando não há foto (ex.: "Penteados").
  label?: string;
  shape?: "arch" | "tile";
  priority?: boolean;
  sizes?: string;
  className?: string;
};

// Moldura da marca: arco como os espelhos do salão. Mostra vídeo, foto ou,
// sem mídia, um fundo chocolate com cachos desenhados.
export function SalonArt({
  image,
  video,
  alt = "",
  label,
  shape = "arch",
  priority,
  sizes = "(max-width: 900px) 90vw, 40vw",
  className,
}: SalonArtProps) {
  return (
    <div className={cn("salon-art", `salon-art--${shape}`, className)}>
      {video ? (
        <video
          className="salon-art__media"
          autoPlay
          muted
          loop
          playsInline
          poster={image ?? undefined}
          aria-label={alt || undefined}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : image ? (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="salon-art__media"
        />
      ) : (
        <div
          className="salon-art__placeholder"
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
        >
          <CurlPattern />
          {label && <span className="salon-art__label">{label}</span>}
        </div>
      )}
    </div>
  );
}

function CurlPattern() {
  return (
    <svg
      className="salon-art__curls"
      viewBox="0 0 200 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path
          d="M-10 40c20-25 45 5 30 22s-40 2-25-20 55-28 70-5-5 45-25 35 5-45 40-45 45 30 30 50-40 10-25-12 50-35 75-10"
          strokeWidth="2.2"
        />
        <path
          d="M-20 120c25-20 50 10 35 26s-42 0-26-22 58-25 72-2-6 44-27 33 7-46 43-44 44 33 28 52-42 8-26-14 52-34 80-8"
          strokeWidth="1.6"
        />
        <path
          d="M-15 200c22-24 48 6 32 23s-41 1-25-21 57-27 71-4-5 45-26 34 6-45 41-45 45 31 29 51-41 9-25-13 51-35 77-9"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
