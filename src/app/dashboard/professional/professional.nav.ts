import {
  CalendarDays,
  ChartNoAxesCombined,
  House,
  Package,
  ReceiptText,
  Scissors,
  UserRound,
} from "lucide-react";
import type { DashboardNavItem } from "../_shared/components/DashboardSidebar";

export const professionalNav: DashboardNavItem[] = [
  { label: "Início", href: "/dashboard?view=inicio", icon: House },
  { label: "Minha agenda", href: "/dashboard?view=agenda", icon: CalendarDays },
  { label: "Comandas", href: "/dashboard?view=comandas", icon: ReceiptText },
  { label: "Estoque", href: "/dashboard?view=estoque", icon: Package },
  {
    label: "Ganhos",
    href: "/dashboard?view=ganhos",
    icon: ChartNoAxesCombined,
  },
  { label: "Serviços", href: "/dashboard?view=servicos", icon: Scissors },
  { label: "Minha conta", href: "/dashboard?view=conta", icon: UserRound },
];
