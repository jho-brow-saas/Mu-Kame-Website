import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Ranking Semanal — MU Kame";
const description = "Acompanhe os heróis mais ativos da semana no MU Kame. Resets conquistados nos últimos 7 dias.";

export const Route = createFileRoute("/rankings/semanal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/semanal" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/semanal" }],
  }),
  component: () => (
    <RankingView
      kind="semanal"
      title="Ranking semanal"
      description="Resets conquistados na semana corrente (resetsWeek)."
      valueLabel="Resets na semana"
    />
  ),
});
