import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking Blood Castle — MU Kame";
const description = "Classificação oficial dos melhores desempenhos no evento Blood Castle do MU Kame.";

export const Route = createFileRoute("/rankings/blood-castle")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/blood-castle" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/blood-castle" }],
  }),
  component: () => (
    <RankingView
      kind="blood-castle"
      title="Ranking Blood Castle"
      description="Melhores desempenhos registrados no Blood Castle."
      valueLabel="Pontuação"
    />
  ),
});
