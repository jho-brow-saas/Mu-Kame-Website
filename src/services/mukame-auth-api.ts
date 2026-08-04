import type { AuthErrorPayload } from "@/types/mukame-auth";

export class MukameAuthError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "MukameAuthError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Camada central de autenticação do MU Kame API 2.0.
 * Baseada em cookies seguros (HttpOnly, Secure, Lax).
 */
export async function authRequest<T>(
  route: string,
  options: RequestInit = {}
): Promise<T> {
  // Em produção, as chamadas de autenticação vão direto para o domínio da API
  // O navegador gerencia o cookie via credentials: "include"
  const url = `https://api.mukame.online/index.php?route=${encodeURIComponent(route)}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include", // OBRIGATÓRIO para cookies
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json();

  if (!response.ok || payload?.ok !== true) {
    const errorPayload = payload as AuthErrorPayload;
    throw new MukameAuthError(
      errorPayload?.error?.code ?? "AUTH_REQUEST_FAILED",
      errorPayload?.error?.message ?? "Não foi possível concluir a solicitação.",
      response.status
    );
  }

  return payload;
}
