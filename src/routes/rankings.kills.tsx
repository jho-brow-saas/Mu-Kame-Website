import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Top Kills — MU Kame";
const description = "Classificação oficial de abates registrados no MU Kame.";

export const Route = createFileRoute("/rankings/kills")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/kills" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/kills" }],
  }),
  component: () => (
    <RankingView
      kind="kills"
      title="Top Kills"
      description="Classificação por abates registrados (Kills)."
      valueLabel="Kills"
    />
  ),
});
