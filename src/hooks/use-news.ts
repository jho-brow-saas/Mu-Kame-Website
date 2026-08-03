import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

/** Notícias oficiais publicadas pela API (somente leitura). */
export function useNews(limit = 6) {
  return useQuery({
    queryKey: muKameQueryKeys.news(limit),
    queryFn: ({ signal }) => muKameApi.news(limit, signal),
    staleTime: 60_000,
    retry: 1,
  });
}
