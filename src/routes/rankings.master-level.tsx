import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/master-level")({
  component: () => (
    <RankingView
      kind="master-level"
      title="Top Master Level"
      description="Classificação pelo Master Level, com máximo de 400."
      valueLabel="Master Level"
    />
  ),
});
