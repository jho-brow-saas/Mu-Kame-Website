import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";
import type { RankingType } from "@/types/mukame-api";

/** Ranking oficial por tipo. Permanece vazio até a API liberar dados públicos. */
export function useRankings(type: RankingType, limit = 10) {
  return useQuery({
    queryKey: muKameQueryKeys.rankings(type, limit),
    queryFn: ({ signal }) => muKameApi.rankings(type, limit, signal),
    staleTime: 60_000,
    retry: 1,
  });
}
