import { serverConfig } from "@/config/server";

/**
 * Camada de serviço do frontend.
 * O navegador NUNCA acessa o SQL Server diretamente: todas as chamadas
 * passam por uma API HTTPS hospedada na VPS.
 */
export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "";

/** Sem API configurada, o site opera em modo demonstrativo neutro (sem dados falsos). */
export const DEMO_MODE = API_BASE_URL === "";

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
