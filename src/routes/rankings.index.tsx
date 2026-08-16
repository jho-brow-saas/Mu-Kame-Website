import { createFileRoute } from "@tanstack/react-router";
import { RankingPreviewGrid } from "@/components/rankings/RankingPreviewGrid";

const title = "Visão Geral dos Rankings — MU Kame";
const description = "Confira os destaques do MU Kame: top resets, level, PK, guilds e muito mais em tempo real.";

export const Route = createFileRoute("/rankings/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/rankings" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/rankings" }],
  }),
  component: () => <RankingPreviewGrid />,
});
