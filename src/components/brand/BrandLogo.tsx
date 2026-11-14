import { cn } from "@/utils/class-names";
import "./BrandLogo.scss";

type BrandLogoProps = {
  // "mark" é só o selo redondo; "full" acrescenta o nome ao lado.
  variant?: "mark" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function BrandLogo({
  variant = "full",
  size = "md",
  className,
}: BrandLogoProps) {
  return (
    <span className={cn("brand-logo", `brand-logo--${size}`, className)}>
      <span className="brand-logo__mark" aria-hidden="true">
        <span className="brand-logo__script">cachos</span>
        <span className="brand-logo__city">aju</span>
      </span>
      {variant === "full" && (
        <span className="brand-logo__name">
          Espaço <em>Cachos</em> Aju
        </span>
      )}
      {variant === "mark" && <span className="sr-only">Espaço Cachos Aju</span>}
    </span>
  );
}
