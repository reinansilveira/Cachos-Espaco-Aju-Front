import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SalonArt } from "@/components/salon-art/SalonArt";
import { PHOTOS } from "@/salon/salon.data";
import "./AuthLayout.scss";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <section className="auth-page__form-side">{children}</section>

      <aside className="auth-page__showcase">
        <div className="auth-page__image-frame">
          <SalonArt
            image={PHOTOS.reception}
            alt="Espaço Cachos Aju"
            className="auth-page__art"
            sizes="(max-width: 900px) 0px, 40vw"
          />
          <div className="auth-page__brand">
            <BrandLogo variant="mark" size="lg" />
            <p className="auth-page__tagline">Cachos, ondas e crespos 🤎</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
