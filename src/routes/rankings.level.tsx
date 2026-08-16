import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Top Level — MU Kame";
const description = "Classificação oficial dos personagens com maior nível (cLevel) no MU Kame.";

export const Route = createFileRoute("/rankings/level")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/level" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/level" }],
  }),
  component: () => (
    <RankingView
      kind="level"
      title="Top Level"
      description="Classificação pelo nível do personagem (cLevel)."
      valueLabel="Level"
    />
  ),
});
