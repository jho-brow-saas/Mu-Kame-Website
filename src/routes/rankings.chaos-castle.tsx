import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/chaos-castle")({
  component: () => (
    <RankingView
      kind="chaos-castle"
      title="Ranking Chaos Castle"
      description="Melhores desempenhos registrados no Chaos Castle."
      valueLabel="Pontuação"
    />
  ),
});
