import type { Metadata, Viewport } from "next";
import { BUSINESS } from "@/config/business";
import "./globals.css";
import {
  Allura,
  Bodoni_Moda,
  Cormorant_Garamond,
  Inter,
  Inter_Tight,
} from "next/font/google";
import Header from "@/layouts/header/Header";
import Footer from "@/layouts/footer/Footer";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

// Site público: Bodoni como no logo do salão, grotesca para os títulos.
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const tight = Inter_Tight({
  variable: "--font-tight",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Só para a marca "cachos", como no logo do salão.
const script = Allura({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3011";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: BUSINESS.name, template: `%s | ${BUSINESS.name}` },
  description: BUSINESS.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: BUSINESS.name,
    title: BUSINESS.name,
    description: BUSINESS.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#2a1a12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${bodoni.variable} ${tight.variable} ${script.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
