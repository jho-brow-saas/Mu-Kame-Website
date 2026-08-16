import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking Devil Square — MU Kame";
const description = "Classificação oficial dos melhores desempenhos no evento Devil Square do MU Kame.";

export const Route = createFileRoute("/rankings/devil-square")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/devil-square" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/devil-square" }],
  }),
  component: () => (
    <RankingView
      kind="devil-square"
      title="Ranking Devil Square"
      description="Melhores desempenhos registrados no Devil Square."
      valueLabel="Pontuação"
    />
  ),
});
