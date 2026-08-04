/**
 * Contratos da API pública oficial do MU Kame (somente leitura).
 *
 * Base: https://api.mukame.online/index.php
 * O frontend nunca fala com o SQL Server: apenas com esta API HTTPS.
 */

export type MuKameEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: MuKameMeta;
};

export type MuKameMeta = {
  generatedAt?: string;
  apiVersion?: string;
  readOnly?: boolean;
  limit?: number;
  total?: number;
};

/* --------------------------------- health -------------------------------- */

export type HealthPayload = {
  api: string;
  status: string;
  database: string;
  version: string;
  php?: string;
  readOnly?: boolean;
};

/* -------------------------------- settings ------------------------------- */

export type SettingsPayload = {
  serverName: string;
  slogan: string;
  season: string;
  mode: string;
  platforms: {
    pc: boolean;
    android: boolean;
  };
  launchDate: string;
  masterLevel: number;
  maxStats: number;
  language: string;
  timezone: string;
  castleSiegeSchedule: string | null;
  android: boolean;
};

/* --------------------------------- status -------------------------------- */

export type ServerState = "preparing" | "online" | "offline" | "maintenance";

export type ServerInfo = {
  name: string;
  season: string;
  mode: string;
  platform: string;
  launchDate: string;
  masterLevel: number;
  maxStats: number;
  supportWhatsApp: string;
  socialHandle: string;
  publicDataEnabled: boolean;
};

export type StatusPayload = {
  server: ServerInfo;
  state: ServerState;
  onlinePlayers: number;
  publicDataEnabled: boolean;
  message?: string | null;
};

/* ---------------------------------- news --------------------------------- */

export type NewsApiItem = {
  id: number | string;
  title: string;
  content: string;
  /** Pode chegar como ISO 8601 ou como timestamp Unix em string. */
  publishedAt?: string | number | null;
};

export type NewsPayload = {
  items: NewsApiItem[];
};

/* ------------------------------- downloads ------------------------------- */

export type DownloadApiItem = {
  id: string;
  name: string;
  platform: string;
  type: string;
  url: string | null;
  available: boolean;
  message?: string | null;
};

export type DownloadsPayload = {
  items: DownloadApiItem[];
};

/* --------------------------------- events -------------------------------- */

export type EventCategory = "classic" | "pvp" | "invasion" | "guild" | "custom";

export type EventApiItem = {
  id: string;
  name: string;
  category: EventCategory | string;
  schedule: string | null;
};

export type EventsPayload = {
  items: EventApiItem[];
};

/* ------------------------------ castle siege ----------------------------- */

export type CastleSiegeInfo = {
  mapServerGroup?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  siegeEnded?: number | null;
  castleOccupied?: number | null;
  ownerGuild?: string | null;
  chaosTax?: number | null;
  storeTax?: number | null;
  huntZoneTax?: number | null;
};

export type CastleSiegePayload = {
  configured: boolean;
  castleSiege?: CastleSiegeInfo | null;
  message?: string | null;
};

/* -------------------------------- rankings ------------------------------- */

export const RANKING_TYPES = [
  "reset",
  "master-reset",
  "level",
  "pk",
  "kills",
  "guilds",
  "blood-castle",
  "devil-square",
  "chaos-castle",
] as const;

export type RankingType = (typeof RANKING_TYPES)[number];

export type RankingApiItem = {
  position?: number | null;
  rank?: number | null;
  name?: string | null;
  character?: string | null;
  guild?: string | null;
  guildName?: string | null;
  class?: string | null;
  className?: string | null;
  value?: number | string | null;
  score?: number | string | null;
  level?: number | null;
  resets?: number | null;
  masterResets?: number | null;
  pkCount?: number | null;
  kills?: number | null;
  members?: number | null;
};

export type RankingPayload = {
  type: string;
  items: RankingApiItem[];
  publicDataEnabled: boolean;
  message?: string | null;
};

/* ----------------------------------- vip ---------------------------------- */

export type VipBenefit = {
  id: string;
  label: string;
  value: string | number | boolean;
};

export type VipPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  available: boolean;
  benefits?: VipBenefit[];
};

export type VipPayload = {
  plans: VipPlan[];
};

/* --------------------------------- socials -------------------------------- */

export type SocialChannel = {
  id: string;
  label: string;
  url: string;
  handle: string;
  available: boolean;
};

export type SocialsPayload = {
  whatsapp: SocialChannel;
  instagram: SocialChannel;
  tiktok: SocialChannel;
  discord: SocialChannel;
};

/* ---------------------------------- rates --------------------------------- */

export type AccountLevel = "AL0" | "AL1" | "AL2" | "AL3";

export type RateServer = {
  name: string;
  normalExp: number | null;
  masterExp: number | null;
  itemDrop: number | null;
  zenDrop: number | null;
  accountLevels: Record<AccountLevel, {
    experience: number | null;
    drop: number | null;
  }>;
};

export type ResetSettings = {
  command: string;
  requiredLevel: number;
  zenCost: number | string;
  autoReset: boolean;
  levelAfterReset: number;
  inventoryPreserved: boolean;
  skillsPreserved: boolean;
  questRequired: boolean;
};

export type RatesPayload = {
  accountLevels: Record<AccountLevel, string>;
  servers: RateServer[];
  reset: ResetSettings;
  levelUpPoints: Record<string, number>;
  notes: string[];
};

/* --------------------------------- rules ---------------------------------- */

export type RuleSeverity = "critical" | "high" | "medium" | "info";

export type RuleApiItem = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  severity: RuleSeverity;
};

export type RulesPayload = {
  items: RuleApiItem[];
};

/* ---------------------------------- faq ----------------------------------- */

export type FaqApiItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type FaqPayload = {
  items: FaqApiItem[];
};
