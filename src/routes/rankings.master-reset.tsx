import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

export const Route = createFileRoute("/rankings/master-reset")({
  component: () => (
    <RankingView
      kind="master-reset"
      title="Top Master Reset"
      description="Classificação por Master Resets (MasterResetCount)."
      valueLabel="Master Resets"
    />
  ),
});
