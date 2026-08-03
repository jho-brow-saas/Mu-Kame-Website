import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/pk")({
  component: () => (
    <RankingView
      kind="pk"
      title="Top PK"
      description="Classificação por assassinatos de jogadores (PkCount e PkLevel)."
      valueLabel="PK"
    />
  ),
});
