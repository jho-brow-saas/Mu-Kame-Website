import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

/** Eventos oficiais e seus cronogramas (quando divulgados). */
export function useEvents() {
  return useQuery({
    queryKey: muKameQueryKeys.events,
    queryFn: ({ signal }) => muKameApi.events(signal),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
