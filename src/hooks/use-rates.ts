import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

export function useRates() {
  return useQuery({
    queryKey: muKameQueryKeys.rates,
    queryFn: ({ signal }) => muKameApi.rates(signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

