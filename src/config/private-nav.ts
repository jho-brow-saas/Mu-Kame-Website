import type { Permission } from "@/config/access";
import {
  Activity,
  Coins,
  Crown,
  Download,
  FileClock,
  Gauge,
  Images,
  LifeBuoy,
  Newspaper,
  ScrollText,
  ShieldCheck,
  Sword,
  TrendingUp,
  UserCog,
  Users,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PrivateNavItem = {
  to: string;
  label: string;
  code: string;
  icon: LucideIcon;
  permission?: Permission;
};

export const playerNav: PrivateNavItem[] = [
  { to: "/conta", label: "Resumo da conta", code: "KAM-00", icon: ScrollText },
  { to: "/conta/personagens", label: "Personagens", code: "KAM-01", icon: Sword },
  { to: "/conta/evolucao", label: "Evolução", code: "KAM-02", icon: TrendingUp },
  { to: "/conta/vip-moedas", label: "VIP e moedas", code: "KAM-03", icon: Coins },
  { to: "/conta/downloads", label: "Downloads", code: "KAM-04", icon: Download },
  { to: "/conta/chamados", label: "Chamados", code: "KAM-05", icon: LifeBuoy },
  { to: "/conta/seguranca", label: "Segurança", code: "KAM-06", icon: ShieldCheck },
];

export const adminNav: PrivateNavItem[] = [
  { to: "/admin", label: "Painel geral", code: "CMD-00", icon: Gauge, permission: "admin.view" },
  { to: "/admin/contas", label: "Contas", code: "CMD-01", icon: Users, permission: "accounts.read" },
  { to: "/admin/personagens", label: "Personagens", code: "CMD-02", icon: Sword, permission: "characters.read" },
  { to: "/admin/vip", label: "VIP", code: "CMD-03", icon: Crown, permission: "vip.write" },
  { to: "/admin/moedas", label: "Moedas", code: "CMD-04", icon: Coins, permission: "wallet.write" },
  { to: "/admin/online", label: "Online", code: "CMD-05", icon: Wifi, permission: "online.read" },
  { to: "/admin/chamados", label: "Chamados", code: "CMD-06", icon: LifeBuoy, permission: "tickets.read" },
  { to: "/admin/noticias", label: "Notícias", code: "CMD-07", icon: Newspaper, permission: "news.write" },
  { to: "/admin/downloads", label: "Downloads", code: "CMD-08", icon: Download, permission: "downloads.write" },
  { to: "/admin/conteudo", label: "Conteúdo e mídia", code: "CMD-09", icon: Images, permission: "content.write" },
  { to: "/admin/diagnostico", label: "Diagnóstico", code: "CMD-10", icon: Activity, permission: "diagnostics.read" },
  { to: "/admin/auditoria", label: "Auditoria", code: "CMD-11", icon: FileClock, permission: "audit.read" },
];

export const roleIcon: LucideIcon = UserCog;
