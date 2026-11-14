import Link from "next/link";
import { cn } from "@/utils/class-names";

// Logo do salão: círculo marrom com "cachos" e "AJU", como no Instagram.
export function Logo({
  size = "md",
  withName = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  withName?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("s-logo", `s-logo--${size}`, className)}
      aria-label="Espaço Cachos Aju, início"
    >
      <span className="s-logo__seal" aria-hidden="true">
        <span className="s-logo__word">cachos</span>
        <span className="s-logo__city">AJU</span>
      </span>
      {withName && (
        <span className="s-logo__name">
          Espaço <b>Cachos Aju</b>
        </span>
      )}
    </Link>
  );
}
