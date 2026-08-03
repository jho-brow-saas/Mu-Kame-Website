import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

/** Estado do Castle Siege: guild proprietária, janela do evento e tributos. */
export function useCastleSiege() {
  return useQuery({
    queryKey: muKameQueryKeys.castleSiege,
    queryFn: ({ signal }) => muKameApi.castleSiege(signal),
    staleTime: 60_000,
    retry: 1,
  });
}
