import type {
  CastleSiegePayload,
  DownloadsPayload,
  EventsPayload,
  HealthPayload,
  MuKameEnvelope,
  NewsPayload,
  RankingPayload,
  RankingType,
  SettingsPayload,
  SocialsPayload,
  StatusPayload,
  VipPayload,
  RatesPayload,
  RulesPayload,
  FaqPayload,
} from "@/types/mukame-api";
import { normalizeRates } from "@/lib/normalize-rates";

/**
 * Camada única de acesso à API pública do MU Kame.
 *
 * - Somente leitura (GET). Nenhum POST/PUT/PATCH/DELETE.
 * - Nenhuma credencial, token ou segredo trafega daqui.
 * - Toda lógica de fetch, timeout e validação de envelope vive neste arquivo.
 */
export const API_BASE_URL = "https://api.mukame.online/index.php";

/**
 * A API oficial libera CORS para os domínios de produção do MU Kame, então o
 * navegador chama `API_BASE_URL` diretamente. Origens de desenvolvimento/prévia
 * (localhost e *.lovable.app) não estão na allowlist da API e continuam usando
 * o proxy somente-leitura de mesma origem apenas como fallback de dev.
 */
const PROXY_PATH = "/api/public/mukame";

/** Domínios em que a API oficial responde com `Access-Control-Allow-Origin`. */
const DIRECT_API_HOSTS = new Set([
  "novo.mukame.online",
  "mukame.online",
  "www.mukame.online",
  "mu-kame-teste.lovable.app", // Domínio de produção do Lovable (se houver)
]);

/** Timeout padrão das requisições públicas. Aumentado para lidar com latência de rede. */
const REQUEST_TIMEOUT_MS = 15_000;

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

/** No navegador: direto em produção oficial, proxy de mesma origem em qualquer outro host. */
function useDevProxy(): boolean {
  if (typeof window === "undefined") return false;
  
  const hostname = window.location.hostname;

  // Se for um dos hosts oficiais de produção, usamos chamada DIRETA
  if (DIRECT_API_HOSTS.has(hostname)) {
    return false;
  }

  // Se for localhost, preview do Lovable ou qualquer outro subdomínio, usamos o PROXY
  // Isso centraliza o tratamento para evitar erros de CORS em qualquer ambiente de desenvolvimento
  return true;
}

function buildUrl(params: QueryParams): string {
  const viaProxy = useDevProxy();
  const url = new URL(viaProxy ? PROXY_PATH : API_BASE_URL, viaProxy ? window.location.origin : undefined);
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, String(value));
  }
  url.search = search.toString();
  return url.toString();
}



/** Requisição GET genérica com retries, timeout, validação de HTTP e do envelope `ok`. */
export async function fetchMuKameApi<T>(params: QueryParams, signal?: AbortSignal, retries = 2): Promise<T> {
  const attemptFetch = async (currentAttempt: number): Promise<T> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const onExternalAbort = () => controller.abort();
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener("abort", onExternalAbort, { once: true });
    }

    try {
      const url = buildUrl(params);
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new MuKameApiError("http", `A API respondeu com falha (${response.status}).`, response.status);
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
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      
      // Se não for abortado externamente e ainda houver tentativas, tenta novamente
      if (!signal?.aborted && currentAttempt < retries) {
        console.warn(`[MU Kame API] Tentativa ${currentAttempt + 1} falhou, tentando novamente...`, error);
        // Pequeno delay exponencial entre retries
        await new Promise(resolve => setTimeout(resolve, 800 * (currentAttempt + 1)));
        return attemptFetch(currentAttempt + 1);
      }

      if (error instanceof MuKameApiError) throw error;
      if (isAbort) {
        if (signal?.aborted) throw error;
        throw new MuKameApiError("timeout", "A API demorou demais para responder.");
      }

      const message = error instanceof Error ? error.message : "Desconhecido";
      console.error(`[MU Kame API] Erro de rede em ${JSON.stringify(params)}:`, error);

      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const isLovable = hostname.endsWith(".lovableproject.com") || hostname.endsWith(".lovable.app");
      
      let userMessage = `Não foi possível alcançar a API do servidor (${message}).`;
      
      if (isLovable) {
        userMessage += " Este erro é comum no ambiente de visualização devido a restrições de rede temporárias. Por favor, tente recarregar a página.";
      }

      throw new MuKameApiError("network", userMessage);
    } finally {
      clearTimeout(timeout);
      if (signal) signal.removeEventListener("abort", onExternalAbort);
    }
  };

  return attemptFetch(0);
}

/* ------------------------------- endpoints ------------------------------- */

export const muKameApi = {
  health: (signal?: AbortSignal) => fetchMuKameApi<HealthPayload>({ route: "health" }, signal),

  settings: (signal?: AbortSignal) => fetchMuKameApi<SettingsPayload>({ route: "settings" }, signal),

  status: (signal?: AbortSignal) => fetchMuKameApi<StatusPayload>({ route: "status" }, signal),

  news: (limit = 6, signal?: AbortSignal) => fetchMuKameApi<NewsPayload>({ route: "news", limit }, signal),

  downloads: (signal?: AbortSignal) => fetchMuKameApi<DownloadsPayload>({ route: "downloads" }, signal),

  events: (signal?: AbortSignal) => fetchMuKameApi<EventsPayload>({ route: "events" }, signal),

  castleSiege: (signal?: AbortSignal) =>
    fetchMuKameApi<CastleSiegePayload>({ route: "castle-siege" }, signal),

  rankings: (type: RankingType, limit = 10, signal?: AbortSignal) =>
    fetchMuKameApi<RankingPayload>({ route: "rankings", type, limit }, signal),

  vip: (signal?: AbortSignal) => fetchMuKameApi<VipPayload>({ route: "vip" }, signal).then(data => {
    if (!data || !Array.isArray(data.plans)) return { plans: [] };
    return data;
  }),
  socials: (signal?: AbortSignal) => fetchMuKameApi<SocialsPayload>({ route: "socials" }, signal),
  rates: (signal?: AbortSignal) => fetchMuKameApi<unknown>({ route: "rates" }, signal).then(normalizeRates),
  rules: (signal?: AbortSignal) => fetchMuKameApi<RulesPayload>({ route: "rules" }, signal).then(data => {
    if (!data || !Array.isArray(data.items)) return { items: [] };
    return data;
  }),
  faq: (signal?: AbortSignal) => fetchMuKameApi<FaqPayload>({ route: "faq" }, signal).then(data => {
    if (!data || !Array.isArray(data.items)) return { items: [] };
    return data;
  }),
} as const;

/** Chaves de cache centralizadas (preparadas para a fase autenticada). */
export const muKameQueryKeys = {
  health: ["mukame", "health"] as const,
  settings: ["mukame", "settings"] as const,
  status: ["mukame", "status"] as const,
  news: (limit: number) => ["mukame", "news", limit] as const,
  downloads: ["mukame", "downloads"] as const,
  events: ["mukame", "events"] as const,
  castleSiege: ["mukame", "castle-siege"] as const,
  rankings: (type: RankingType, limit: number) => ["mukame", "rankings", type, limit] as const,
  vip: ["mukame", "vip"] as const,
  socials: ["mukame", "socials"] as const,
  rates: ["mukame", "rates"] as const,
  rules: ["mukame", "rules"] as const,
  faq: ["mukame", "faq"] as const,
};
