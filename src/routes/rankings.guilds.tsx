import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/guilds")({
  component: () => (
    <RankingView
      kind="guilds"
      title="Top Guilds"
      description="Classificação por pontuação de guild (G_Score) e número de membros."
      valueLabel="Pontuação"
    />
  ),
});
