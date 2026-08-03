import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

/** Status oficial do servidor: alimenta hero, barra de status e contador. */
export function useServerStatus() {
  return useQuery({
    queryKey: muKameQueryKeys.status,
    queryFn: ({ signal }) => muKameApi.status(signal),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}

/** Diagnóstico interno da API (não é bloco visual principal). */
export function useApiHealth(enabled = true) {
  return useQuery({
    queryKey: muKameQueryKeys.health,
    queryFn: ({ signal }) => muKameApi.health(signal),
    staleTime: 60_000,
    retry: 1,
    enabled,
  });
}
