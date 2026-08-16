import { createFileRoute } from "@tanstack/react-router";
import { RankingView } from "@/components/rankings/RankingView";

const title = "Top PK — MU Kame";
const description = "Classificação oficial dos jogadores com mais abates (PK) no MU Kame.";

export const Route = createFileRoute("/rankings/pk")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings/pk" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings/pk" }],
  }),
  component: () => (
    <RankingView
      kind="pk"
      title="Top PK"
      description="Classificação por assassinatos de jogadores (PkCount e PkLevel)."
      valueLabel="PK"
    />
  ),
});
