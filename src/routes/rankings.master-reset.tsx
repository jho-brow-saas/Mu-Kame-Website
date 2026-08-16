import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Top Master Reset — MU Kame";
const description = "Classificação oficial dos jogadores lendários com mais Master Resets acumulados no MU Kame.";

export const Route = createFileRoute("/rankings/master-reset")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/master-reset" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/master-reset" }],
  }),
  component: () => (
    <RankingView
      kind="master-reset"
      title="Top Master Reset"
      description="Classificação por Master Resets (MasterResetCount)."
      valueLabel="Master Resets"
    />
  ),
});
