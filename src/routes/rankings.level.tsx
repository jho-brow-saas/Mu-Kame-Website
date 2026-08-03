import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/level")({
  component: () => (
    <RankingView
      kind="level"
      title="Top Level"
      description="Classificação pelo nível do personagem (cLevel)."
      valueLabel="Level"
    />
  ),
});
