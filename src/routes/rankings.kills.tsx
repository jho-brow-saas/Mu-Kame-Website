import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/kills")({
  component: () => (
    <RankingView
      kind="kills"
      title="Top Kills"
      description="Classificação por abates registrados (Kills)."
      valueLabel="Kills"
    />
  ),
});
