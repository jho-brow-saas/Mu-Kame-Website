import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/semanal")({
  component: () => (
    <RankingView
      kind="semanal"
      title="Ranking semanal"
      description="Resets conquistados na semana corrente (resetsWeek)."
      valueLabel="Resets na semana"
    />
  ),
});
