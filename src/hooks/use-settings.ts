import { useSuspenseQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

export function useSettings() {
  return useSuspenseQuery({
    queryKey: muKameQueryKeys.settings,
    queryFn: ({ signal }) => muKameApi.settings(signal),
    staleTime: 1000 * 60 * 60, // 60 minutes
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
