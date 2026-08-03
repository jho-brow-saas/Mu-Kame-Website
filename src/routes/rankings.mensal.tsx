import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/mensal")({
  component: () => (
    <RankingView
      kind="mensal"
      title="Ranking mensal"
      description="Resets conquistados no mês corrente (resetsMonth)."
      valueLabel="Resets no mês"
    />
  ),
});
