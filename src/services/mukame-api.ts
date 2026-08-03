import type {
  CastleSiegePayload,
  DownloadsPayload,
  EventsPayload,
  HealthPayload,
  MuKameEnvelope,
  NewsPayload,
  RankingPayload,
  RankingType,
  StatusPayload,
} from "@/types/mukame-api";

/**
 * Camada única de acesso à API pública do MU Kame.
 *
 * - Somente leitura (GET). Nenhum POST/PUT/PATCH/DELETE.
 * - Nenhuma credencial, token ou segredo trafega daqui.
 * - Toda lógica de fetch, timeout e validação de envelope vive neste arquivo.
 */
export const API_BASE_URL = "https://api.mukame.online/index.php";

/**
 * A API oficial não envia cabeçalhos CORS. No navegador as chamadas passam
 * pelo proxy somente-leitura de mesma origem; no servidor (SSR) vamos direto
 * ao upstream.
 */
const PROXY_PATH = "/api/public/mukame";

/** Timeout padrão das requisições públicas. */
const REQUEST_TIMEOUT_MS = 8_000;

export type MuKameErrorKind = "timeout" | "network" | "http" | "payload";

/** Erro padronizado: nunca carrega stack de servidor nem detalhe interno. */
export class MuKameApiError extends Error {
  readonly kind: MuKameErrorKind;
  readonly status: number | null;

  constructor(kind: MuKameErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = "MuKameApiError";
    this.kind = kind;
    this.status = status;
  }
}

export type QueryParams = Record<string, string | number | undefined>;

function buildUrl(params: QueryParams): string {
  const isBrowser = typeof window !== "undefined";
  const url = new URL(isBrowser ? PROXY_PATH : API_BASE_URL, isBrowser ? window.location.origin : undefined);
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, String(value));
  }
  url.search = search.toString();
  return url.toString();
}


/** Requisição GET genérica com timeout, validação de HTTP e do envelope `ok`. */
export async function fetchMuKameApi<T>(params: QueryParams, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    const response = await fetch(buildUrl(params), {
      method: "GET",
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new MuKameApiError("http", "A API do servidor respondeu com falha.", response.status);
    }

    let envelope: MuKameEnvelope<T>;
    try {
      envelope = (await response.json()) as MuKameEnvelope<T>;
    } catch {
      throw new MuKameApiError("payload", "Resposta da API em formato inesperado.");
    }

    if (!envelope || envelope.ok !== true || envelope.data === undefined || envelope.data === null) {
      throw new MuKameApiError("payload", "A API não retornou dados válidos.");
    }

    return envelope.data;
  } catch (error) {
    if (error instanceof MuKameApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      if (signal?.aborted) throw error;
      throw new MuKameApiError("timeout", "A API demorou demais para responder.");
    }
    throw new MuKameApiError("network", "Não foi possível alcançar a API do servidor.");
  } finally {
    clearTimeout(timeout);
    if (signal) signal.removeEventListener("abort", onExternalAbort);
  }
}

/* ------------------------------- endpoints ------------------------------- */

export const muKameApi = {
  health: (signal?: AbortSignal) => fetchMuKameApi<HealthPayload>({ route: "health" }, signal),

  status: (signal?: AbortSignal) => fetchMuKameApi<StatusPayload>({ route: "status" }, signal),

  news: (limit = 6, signal?: AbortSignal) => fetchMuKameApi<NewsPayload>({ route: "news", limit }, signal),

  downloads: (signal?: AbortSignal) => fetchMuKameApi<DownloadsPayload>({ route: "downloads" }, signal),

  events: (signal?: AbortSignal) => fetchMuKameApi<EventsPayload>({ route: "events" }, signal),

  castleSiege: (signal?: AbortSignal) =>
    fetchMuKameApi<CastleSiegePayload>({ route: "castle-siege" }, signal),

  rankings: (type: RankingType, limit = 10, signal?: AbortSignal) =>
    fetchMuKameApi<RankingPayload>({ route: "rankings", type, limit }, signal),
} as const;

/** Chaves de cache centralizadas (preparadas para a fase autenticada). */
export const muKameQueryKeys = {
  health: ["mukame", "health"] as const,
  status: ["mukame", "status"] as const,
  news: (limit: number) => ["mukame", "news", limit] as const,
  downloads: ["mukame", "downloads"] as const,
  events: ["mukame", "events"] as const,
  castleSiege: ["mukame", "castle-siege"] as const,
  rankings: (type: RankingType, limit: number) => ["mukame", "rankings", type, limit] as const,
};
