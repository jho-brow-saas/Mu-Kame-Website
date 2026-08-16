import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking por Classe — MU Kame";
const description = "Classificação oficial dos personagens mais poderosos por classe no MU Kame.";

export const Route = createFileRoute("/rankings/classes")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/classes" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/classes" }],
  }),
  component: () => (
    <RankingView
      kind="classes"
      title="Ranking por classe"
      description="Melhores personagens de cada classe, com filtro por evolução."
      valueLabel="Resets"
    />
  ),
});
