import { onlyDigits } from "@/utils/phone";

const env = (value: string | undefined, fallback: string) =>
  value?.trim() || fallback;

const whatsapp = onlyDigits(
  env(process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP, "5579981750872"),
);

export const BUSINESS = {
  name: "Espaço Cachos Aju",
  description:
    "Salão especializado em cachos, ondas e crespos em Aracaju/SE. Corte, tratamento, cor, penteado e make.",
  email: env(
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL,
    "contato@cachosaju.com.br",
  ),
  address: env(
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS,
    "Rua Maruim, 766, sala 6, Centro, Aracaju - SE",
  ),
  openingHours: env(
    process.env.NEXT_PUBLIC_BUSINESS_HOURS,
    "Terça a sexta, 9h às 18h · Sábado, 8h às 18h",
  ),
  instagram: env(process.env.NEXT_PUBLIC_BUSINESS_INSTAGRAM, "espacocachosaju"),
  facebook: env(process.env.NEXT_PUBLIC_BUSINESS_FACEBOOK, ""),
  whatsappDigits: whatsapp,
};

export const formatBrazilianPhone = (digits: string) => {
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : local;
};

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsappDigits}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const whatsappLabel = formatBrazilianPhone(BUSINESS.whatsappDigits);
export const instagramUrl = `https://instagram.com/${BUSINESS.instagram}`;
export const facebookUrl = `https://facebook.com/${BUSINESS.facebook}`;
