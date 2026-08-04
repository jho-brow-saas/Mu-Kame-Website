import { useSuspenseQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

export function useVip() {
  return useSuspenseQuery({
    queryKey: muKameQueryKeys.vip,
    queryFn: ({ signal }) => muKameApi.vip(signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
