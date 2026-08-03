import { serverConfig } from "@/config/server";
import type { ApiError, ApiHealth, ApiResult } from "@/types/api";

/**
 * Camada de serviço do frontend.
 * O navegador NUNCA acessa o SQL Server diretamente: todas as chamadas
 * passam por uma API HTTPS hospedada na VPS. Nenhum segredo vive aqui —
 * apenas a URL pública configurável.
 */
export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "";

/** Sem API configurada, o site opera em modo demonstrativo neutro (sem dados falsos). */
export const DEMO_MODE = API_BASE_URL === "";

/** Endpoints configuráveis da API v2. */
export const endpoints = {
  status: "/api-v2/status",
  authLogin: "/api-v2/auth/login",
  authLogout: "/api-v2/auth/logout",
  authSession: "/api-v2/auth/session",
  account: "/api-v2/account",
  accountCharacters: "/api-v2/account/characters",
  accountWallet: "/api-v2/account/wallet",
  accountVip: "/api-v2/account/vip",
  accountTickets: "/api-v2/account/tickets",
  adminDashboard: "/api-v2/admin/dashboard",
  adminAccounts: "/api-v2/admin/accounts",
  adminCharacters: "/api-v2/admin/characters",
  adminOnline: "/api-v2/admin/online",
  adminTickets: "/api-v2/admin/tickets",
  adminAudit: "/api-v2/admin/audit",
} as const;

export type EndpointKey = keyof typeof endpoints;

export const disabledError: ApiError = {
  code: "disabled",
  message: "Operação desativada até a API segura entrar em produção.",
};

export const offlineError: ApiError = {
  code: "offline",
  message: "API oficial ainda não configurada. Exibindo estado demonstrativo neutro.",
};

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

export function fail(error: ApiError): ApiResult<never> {
  return { ok: false, error };
}

function normalizeError(status: number): ApiError {
  if (status === 401) return { code: "unauthorized", message: "Sessão expirada. Entre novamente." };
  if (status === 403) return { code: "forbidden", message: "Sem permissão para esta operação." };
  if (status === 404) return { code: "not_found", message: "Registro não encontrado." };
  if (status === 422) return { code: "validation", message: "Dados inválidos." };
  if (status === 429) return { code: "rate_limited", message: "Muitas tentativas. Aguarde alguns instantes." };
  return { code: "unknown", message: `Falha na requisição (${status}).` };
}

/** Cliente HTTP único. Cookies httpOnly de sessão são gerenciados pela API. */
export async function httpRequest<T>(
  path: string,
  init?: { method?: string; body?: unknown; signal?: AbortSignal },
): Promise<ApiResult<T>> {
  if (DEMO_MODE) return fail(offlineError);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: init?.method ?? "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
      ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
      ...(init?.signal ? { signal: init.signal } : {}),
    });
    if (!response.ok) return fail(normalizeError(response.status));
    return ok((await response.json()) as T);
  } catch {
    return fail({ code: "offline", message: "Não foi possível alcançar a API." });
  }
}

export async function checkApiHealth(): Promise<ApiHealth> {
  const checkedAt = new Date().toISOString();
  if (DEMO_MODE) return { reachable: false, baseUrl: "(não configurada)", latencyMs: null, checkedAt };
  const started = performance.now();
  const result = await httpRequest<unknown>(endpoints.status);
  return {
    reachable: result.ok,
    baseUrl: API_BASE_URL,
    latencyMs: Math.round(performance.now() - started),
    checkedAt,
  };
}

/* ------------------------------------------------------------------ */
/* Contratos públicos legados (site institucional)                     */
/* ------------------------------------------------------------------ */

export type ServerStatus = {
  status: "online" | "offline" | "preparing";
  playersOnline: number;
  season: string;
  mode: string;
  masterLevel: number;
  platform: string;
};

export type RankingEntry = {
  position: number;
  name: string;
  guild: string | null;
  className: string;
  value: number;
  extra?: string;
};

export type NewsItem = {
  slug: string;
  subject: string;
  content: string;
  date: string;
  category: "Notícia" | "Evento" | "Atualização" | "Manutenção" | "Comunicado";
};

export type CastleSiegeState = {
  ownerGuild: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  registeredGuilds: number;
  score: number | null;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Falha na requisição: ${response.status}`);
  return (await response.json()) as T;
}

export const api = {
  async getStatus(): Promise<ServerStatus> {
    if (DEMO_MODE) {
      return {
        status: "preparing",
        playersOnline: 0,
        season: serverConfig.season,
        mode: serverConfig.mode,
        masterLevel: serverConfig.masterLevel,
        platform: serverConfig.platform,
      };
    }
    return request<ServerStatus>("/api/status");
  },

  async getRanking(kind: string): Promise<RankingEntry[]> {
    if (DEMO_MODE) return [];
    return request<RankingEntry[]>(`/api/rankings/${kind}`);
  },

  async getCastleSiege(): Promise<CastleSiegeState> {
    if (DEMO_MODE) {
      return {
        ownerGuild: null,
        startDate: null,
        endDate: null,
        status: "Cronograma em preparação",
        registeredGuilds: 0,
        score: null,
      };
    }
    return request<CastleSiegeState>("/api/castle-siege");
  },

  async getNews(): Promise<NewsItem[]> {
    if (DEMO_MODE) return [];
    return request<NewsItem[]>("/api/news");
  },

  async register(payload: { username: string; email: string; password: string }): Promise<{ ok: boolean; message: string }> {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return { ok: true, message: "Cadastro validado em modo demonstrativo. A criação real de contas será liberada com a API oficial." };
    }
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Não foi possível concluir o cadastro.");
    return (await response.json()) as { ok: boolean; message: string };
  },

  async login(payload: { username: string; password: string }): Promise<{ ok: boolean; message: string }> {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return { ok: true, message: "Login em modo demonstrativo. A autenticação real será habilitada com a API oficial." };
    }
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Login ou senha inválidos.");
    return (await response.json()) as { ok: boolean; message: string };
  },
};
