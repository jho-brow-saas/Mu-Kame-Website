import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/blood-castle")({
  component: () => (
    <RankingView
      kind="blood-castle"
      title="Ranking Blood Castle"
      description="Melhores desempenhos registrados no Blood Castle."
      valueLabel="Pontuação"
    />
  ),
});
