import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Top Master Level — MU Kame";
const description = "Classificação oficial dos personagens com maior Master Level (400+) no MU Kame.";

export const Route = createFileRoute("/rankings/master-level")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/master-level" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/master-level" }],
  }),
  component: () => (
    <RankingView
      kind="master-level"
      title="Top Master Level"
      description="Classificação pelo Master Level, com máximo de 400."
      valueLabel="Master Level"
    />
  ),
});
