import { cn } from "@/utils/class-names";

// Formas orgânicas em creme que cortam as seções escuras (e vice-versa).
// Os traços lembram o movimento de um cacho.

export function Blob({
  variant,
  className,
}: {
  variant: "drop" | "wave" | "pebble" | "curl";
  className?: string;
}) {
  return (
    <svg
      className={cn("s-shape", `s-shape--${variant}`, className)}
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {variant === "drop" && (
        <path d="M0 0 H420 C520 120 520 300 380 400 C260 486 120 470 0 520 Z" />
      )}
      {variant === "wave" && (
        <path d="M600 0 V600 H260 C330 520 300 430 360 360 C430 280 520 300 560 200 C590 130 560 60 600 0 Z" />
      )}
      {variant === "pebble" && (
        <path d="M300 30 C460 30 570 140 570 300 C570 460 450 570 290 570 C130 570 30 450 30 300 C30 140 140 30 300 30 Z" />
      )}
      {variant === "curl" && (
        <path
          className="s-shape__line"
          fill="none"
          d="M300 40 C430 40 470 150 410 210 C350 270 250 240 260 170 C270 110 360 120 360 180 M300 230 C450 240 500 360 430 430 C360 500 230 470 240 390 C250 320 360 330 360 400 M300 450 C400 470 420 540 360 580"
        />
      )}
    </svg>
  );
}

// Linha ondulada para separar seções, como a luminária da recepção.
export function WaveEdge({
  flip = false,
  className,
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={cn("s-edge", flip && "s-edge--flip", className)}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 70 C180 30 300 100 480 60 C660 20 780 100 960 60 C1140 20 1260 96 1440 54 V120 H0 Z" />
    </svg>
  );
}

export function CurlMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("s-curl", className)}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d="M24 6 C33 6 36 13 32 17 C28 21 21 19 22 14 C23 10 29 11 28 15 M24 20 C35 20 38 29 33 34 C28 39 19 37 20 31 C21 26 29 27 28 32 M24 38 C30 39 31 43 28 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
