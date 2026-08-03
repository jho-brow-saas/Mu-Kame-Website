import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/reset")({
  component: () => (
    <RankingView
      kind="reset"
      title="Top Reset"
      description="Classificação por quantidade de resets acumulados (ResetCount)."
      valueLabel="Resets"
    />
  ),
});
