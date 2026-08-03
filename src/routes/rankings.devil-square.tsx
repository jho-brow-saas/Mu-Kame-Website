import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/devil-square")({
  component: () => (
    <RankingView
      kind="devil-square"
      title="Ranking Devil Square"
      description="Melhores desempenhos registrados no Devil Square."
      valueLabel="Pontuação"
    />
  ),
});
