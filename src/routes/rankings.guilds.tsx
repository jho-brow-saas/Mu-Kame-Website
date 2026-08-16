import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking de Guilds — MU Kame";
const description = "Classificação oficial das guilds mais poderosas do continente MU Kame.";

export const Route = createFileRoute("/rankings/guilds")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/guilds" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/guilds" }],
  }),
  component: () => (
    <RankingView
      kind="guilds"
      title="Top Guilds"
      description="Classificação por pontuação de guild (G_Score) e número de membros."
      valueLabel="Pontuação"
    />
  ),
});
