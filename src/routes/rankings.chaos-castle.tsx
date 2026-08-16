import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking Chaos Castle — MU Kame";
const description = "Classificação oficial dos melhores desempenhos no evento Chaos Castle do MU Kame.";

export const Route = createFileRoute("/rankings/chaos-castle")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/chaos-castle" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/chaos-castle" }],
  }),
  component: () => (
    <RankingView
      kind="chaos-castle"
      title="Ranking Chaos Castle"
      description="Melhores desempenhos registrados no Chaos Castle."
      valueLabel="Pontuação"
    />
  ),
});
