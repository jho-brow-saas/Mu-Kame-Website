/**
 * Contratos da API pública oficial do MU Kame (somente leitura).
 *
 * Base: https://api.mukame.online/index.php
 * O frontend nunca fala com o SQL Server: apenas com esta API HTTPS.
 * Nenhum segredo, credencial ou token vive nesta camada.
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

/**
 * Enquanto `publicDataEnabled` é false a API devolve `items: []`, então a forma
 * exata dos registros é tolerante: renderizamos apenas o que existir.
 */
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
