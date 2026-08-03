import { useQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";

/** Arquivos oficiais de download expostos pela API. */
export function useDownloads() {
  return useQuery({
    queryKey: muKameQueryKeys.downloads,
    queryFn: ({ signal }) => muKameApi.downloads(signal),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
