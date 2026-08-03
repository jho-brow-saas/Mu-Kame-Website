import { DEMO_MODE, endpoints, fail, httpRequest, offlineError } from "./api";
import type { ApiResult } from "@/types/api";
import type { AppRole, SessionUser } from "@/types/account";

/**
 * Sessão. A API responde com cookie httpOnly; o frontend nunca guarda
 * token, senha, IP ou pergunta secreta. Papel é informativo para a UI —
 * a API DEVE reavaliar o papel em cada requisição.
 */
export type Session = {
  authenticated: boolean;
  user: SessionUser | null;
  role: AppRole | null;
  /** Reautenticação recente exigida por ações críticas. */
  reauthenticatedAt: string | null;
};

export const anonymousSession: Session = {
  authenticated: false,
  user: null,
  role: null,
  reauthenticatedAt: null,
};

export const authService = {
  async session(): Promise<ApiResult<Session>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<Session>(endpoints.authSession);
  },

  async login(payload: { login: string; password: string }): Promise<ApiResult<Session>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<Session>(endpoints.authLogin, { method: "POST", body: payload });
  },

  async logout(): Promise<ApiResult<{ done: true }>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<{ done: true }>(endpoints.authLogout, { method: "POST" });
  },

  /** Reautenticação obrigatória antes de ações críticas no painel. */
  async reauthenticate(payload: { password: string }): Promise<ApiResult<{ reauthenticatedAt: string }>> {
    if (DEMO_MODE) return fail(offlineError);
    return httpRequest<{ reauthenticatedAt: string }>(`${endpoints.authSession}/reauth`, {
      method: "POST",
      body: payload,
    });
  },
};
