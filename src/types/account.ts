import type { OperationEntry, SupportTicket } from "./api";

export type AppRole = "player" | "support" | "moderator" | "admin" | "owner";

export type SessionUser = {
  /** Identificador opaco devolvido pela API — nunca o ID interno do SQL. */
  id: string;
  /** Nome de acesso público. Nunca expor e-mail completo, IP ou pergunta secreta. */
  displayName: string;
  /** E-mail sempre mascarado pela API (ex.: "ka***@dominio.com"). */
  maskedEmail: string;
  role: AppRole;
  online: boolean;
  lastSeenAt: string | null;
};

export type VipStatus = {
  tier: "free" | "bronze" | "prata" | "ouro";
  label: string;
  expiresAt: string | null;
  daysLeft: number | null;
};

export type Wallet = {
  wcoinC: number;
  wcoinP: number;
  goblinPoints: number;
  updatedAt: string | null;
};

export type AccountSummary = {
  user: SessionUser;
  vip: VipStatus;
  wallet: Wallet;
  charactersCount: number;
  blocked: boolean;
  blockedReason: string | null;
  createdAt: string | null;
};

export type AccountHistory = OperationEntry[];
export type AccountTickets = SupportTicket[];

/** Visão administrativa reduzida de uma conta (sem campos sensíveis). */
export type AdminAccountRow = {
  id: string;
  login: string;
  maskedEmail: string;
  role: AppRole;
  vipTier: VipStatus["tier"];
  vipExpiresAt: string | null;
  blocked: boolean;
  online: boolean;
  charactersCount: number;
  createdAt: string | null;
};
