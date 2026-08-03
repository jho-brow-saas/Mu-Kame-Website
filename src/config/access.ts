import type { AppRole } from "@/types/account";

/**
 * Feature flags de mutação. Tudo desativado até a API segura existir.
 * O frontend apenas esconde/desabilita — a API deve recusar no servidor.
 */
export const featureFlags = {
  enablePlayerMutations: false,
  enableAdminMutations: false,
  enableWalletAdjustments: false,
  enableAccountDeletion: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export const roleOrder: AppRole[] = ["player", "support", "moderator", "admin", "owner"];

export const roleLabels: Record<AppRole, string> = {
  player: "Aventureiro",
  support: "Suporte",
  moderator: "Moderador",
  admin: "Administrador",
  owner: "Guardião do Reino",
};

export type Permission =
  | "player.view"
  | "player.mutate"
  | "admin.view"
  | "accounts.read"
  | "accounts.write"
  | "accounts.block"
  | "characters.read"
  | "characters.write"
  | "characters.move"
  | "online.read"
  | "online.disconnect"
  | "vip.write"
  | "wallet.write"
  | "tickets.read"
  | "tickets.reply"
  | "news.write"
  | "downloads.write"
  | "content.write"
  | "diagnostics.read"
  | "audit.read";

const matrix: Record<AppRole, Permission[]> = {
  player: ["player.view", "player.mutate"],
  support: ["player.view", "admin.view", "accounts.read", "characters.read", "online.read", "tickets.read", "tickets.reply"],
  moderator: [
    "player.view",
    "admin.view",
    "accounts.read",
    "accounts.block",
    "characters.read",
    "characters.write",
    "online.read",
    "online.disconnect",
    "tickets.read",
    "tickets.reply",
    "news.write",
    "diagnostics.read",
  ],
  admin: [
    "player.view",
    "admin.view",
    "accounts.read",
    "accounts.write",
    "accounts.block",
    "characters.read",
    "characters.write",
    "characters.move",
    "online.read",
    "online.disconnect",
    "vip.write",
    "wallet.write",
    "tickets.read",
    "tickets.reply",
    "news.write",
    "downloads.write",
    "content.write",
    "diagnostics.read",
    "audit.read",
  ],
  owner: [
    "player.view",
    "player.mutate",
    "admin.view",
    "accounts.read",
    "accounts.write",
    "accounts.block",
    "characters.read",
    "characters.write",
    "characters.move",
    "online.read",
    "online.disconnect",
    "vip.write",
    "wallet.write",
    "tickets.read",
    "tickets.reply",
    "news.write",
    "downloads.write",
    "content.write",
    "diagnostics.read",
    "audit.read",
  ],
};

/**
 * Checagem apenas visual. AVISO: a API DEVE revalidar cada permissão
 * no servidor; nada aqui é barreira de segurança.
 */
export function can(role: AppRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return matrix[role].includes(permission);
}

export function isStaff(role: AppRole | null | undefined): boolean {
  return can(role, "admin.view");
}
