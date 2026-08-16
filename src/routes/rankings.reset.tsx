import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Top Reset — MU Kame";
const description = "Classificação oficial dos guerreiros com mais resets acumulados no continente MU Kame.";

export const Route = createFileRoute("/rankings/reset")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/reset" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/reset" }],
  }),
  component: () => (
    <RankingView
      kind="reset"
      title="Top Reset"
      description="Classificação por quantidade de resets acumulados (ResetCount)."
      valueLabel="Resets"
    />
  ),
});
