import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/classes")({
  component: () => (
    <RankingView
      kind="classes"
      title="Ranking por classe"
      description="Melhores personagens de cada classe, com filtro por evolução."
      valueLabel="Resets"
    />
  ),
});
