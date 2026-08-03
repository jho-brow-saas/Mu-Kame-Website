import { useQuery } from "@tanstack/react-query";
import { anonymousSession, authService, type Session } from "@/services/auth";
import { DEMO_MODE } from "@/services/api";
import type { ApiError, LoadPhase } from "@/types/api";

export type SessionState = {
  session: Session;
  phase: LoadPhase;
  error: ApiError | null;
  refetch: () => void;
};

/**
 * Estado de sessão para as áreas privadas.
 * Sem API configurada, a sessão fica bloqueada: nenhuma credencial ou
 * dado sensível é simulado no cliente.
 */
export function useSession(): SessionState {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => authService.session(),
    staleTime: 30_000,
    retry: false,
  });

  if (DEMO_MODE) {
    return {
      session: anonymousSession,
      phase: "blocked",
      error: null,
      refetch: () => query.refetch(),
    };
  }

  if (query.isPending) {
    return { session: anonymousSession, phase: "loading", error: null, refetch: () => query.refetch() };
  }

  const result = query.data;
  if (!result || !result.ok) {
    const error = result && !result.ok ? result.error : { code: "unknown" as const, message: "Falha ao carregar a sessão." };
    return {
      session: anonymousSession,
      phase: error.code === "unauthorized" ? "blocked" : "error",
      error,
      refetch: () => query.refetch(),
    };
  }

  return {
    session: result.data,
    phase: result.data.authenticated ? "ready" : "blocked",
    error: null,
    refetch: () => query.refetch(),
  };
}
