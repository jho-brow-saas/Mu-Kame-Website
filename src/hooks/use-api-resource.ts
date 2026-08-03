import { useQuery } from "@tanstack/react-query";
import type { ApiError, ApiResult, LoadPhase } from "@/types/api";

export type ResourceState<T> = {
  data: T | null;
  phase: LoadPhase;
  error: ApiError | null;
  refetch: () => void;
};

/**
 * Leitura padronizada de recursos privados com estados
 * loading / vazio / erro / bloqueado / pronto.
 */
export function useApiResource<T>(
  key: readonly unknown[],
  loader: () => Promise<ApiResult<T>>,
  options?: { isEmpty?: (data: T) => boolean; staleTime?: number },
): ResourceState<T> {
  const query = useQuery({
    queryKey: key,
    queryFn: loader,
    staleTime: options?.staleTime ?? 30_000,
    retry: false,
  });

  const refetch = () => {
    void query.refetch();
  };

  if (query.isPending) return { data: null, phase: "loading", error: null, refetch };

  const result = query.data;
  if (!result) return { data: null, phase: "error", error: { code: "unknown", message: "Sem resposta da API." }, refetch };

  if (!result.ok) {
    const blocking: ApiError["code"][] = ["unauthorized", "forbidden", "disabled", "offline"];
    return {
      data: null,
      phase: blocking.includes(result.error.code) ? "blocked" : "error",
      error: result.error,
      refetch,
    };
  }

  const empty = options?.isEmpty ? options.isEmpty(result.data) : false;
  return { data: result.data, phase: empty ? "empty" : "ready", error: null, refetch };
}
