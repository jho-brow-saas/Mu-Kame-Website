import { useSuspenseQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";
import type { RuleSeverity } from "@/types/mukame-api";

export const SEVERITY_LABELS: Record<RuleSeverity, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  info: "Informativa",
};

export function useRules() {
  const query = useSuspenseQuery({
    queryKey: muKameQueryKeys.rules,
    queryFn: ({ signal }) => muKameApi.rules(signal),
    staleTime: 1000 * 60 * 60, // 1 hora (regras não mudam toda hora)
  });

  return {
    ...query,
    rules: query.data?.items ?? [],
  };
}
