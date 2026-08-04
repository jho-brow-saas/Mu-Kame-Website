import { useSuspenseQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

export function useSocials() {
  return useSuspenseQuery({
    queryKey: muKameQueryKeys.socials,
    queryFn: ({ signal }) => muKameApi.socials(signal),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
