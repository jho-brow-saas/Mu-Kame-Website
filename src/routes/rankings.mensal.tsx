import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking Mensal — MU Kame";
const description = "Acompanhe os heróis mais destacados do mês no MU Kame. Resets conquistados nos últimos 30 dias.";

export const Route = createFileRoute("/rankings/mensal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/mensal" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/mensal" }],
  }),
  component: () => (
    <RankingView
      kind="mensal"
      title="Ranking mensal"
      description="Resets conquistados no mês corrente (resetsMonth)."
      valueLabel="Resets no mês"
    />
  ),
});
