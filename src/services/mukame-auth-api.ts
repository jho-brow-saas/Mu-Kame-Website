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
 * Camada central de autenticação do MU Kame API 2.1.1.
 * O navegador gerencia o cookie via credentials: "include".
 */
export async function authRequest<T>(
  route: string,
  options: RequestInit = {}
): Promise<T> {
  const isDevProxy = 
    window.location.hostname !== "novo.mukame.online" && 
    window.location.hostname !== "mu-kame-teste.lovable.app" &&
    window.location.hostname !== "mukame.online" &&
    window.location.hostname !== "www.mukame.online";

  // Em produção, as chamadas vão direto para o domínio da API
  // No preview do Lovable, usamos o proxy local devido ao CORS
  const url = isDevProxy
    ? `/api/public/mukame?route=${encodeURIComponent(route)}`
    : `https://api.mukame.online/index.php?route=${encodeURIComponent(route)}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // OBRIGATÓRIO para cookies HttpOnly
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

  let payload: any;
  try {
    payload = await response.json();
  } catch (err) {
    throw new MukameAuthError(
      "INVALID_API_RESPONSE",
      "O servidor retornou uma resposta inválida.",
      response.status
    );
  }

  if (!response.ok || payload?.ok !== true) {
    const errorPayload = payload as AuthErrorPayload;
    throw new MukameAuthError(
      errorPayload?.error?.code ?? "AUTH_REQUEST_FAILED",
      errorPayload?.error?.message ?? "Não foi possível concluir a solicitação.",
      response.status
    );
  }

    return payload as T;
  } catch (err) {
    if (err instanceof MukameAuthError) throw err;

    const message = err instanceof Error ? err.message : "Erro desconhecido";
    const hostname = window.location.hostname;
    const isLovable = hostname.endsWith(".lovableproject.com") || hostname.endsWith(".lovable.app");

    let userMessage = `Não foi possível alcançar a API do servidor (${message}).`;
    if (isLovable) {
      userMessage += " Este erro é comum no ambiente de visualização devido a restrições de rede temporárias. Por favor, tente recarregar a página.";
    }

    throw new MukameAuthError("NETWORK_ERROR", userMessage, 502);
  }
}
