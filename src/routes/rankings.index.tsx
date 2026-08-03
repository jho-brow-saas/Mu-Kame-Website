import { createFileRoute } from "@tanstack/react-router";
import { RankingPreviewGrid } from "@/components/rankings/RankingPreviewGrid";

export const Route = createFileRoute("/rankings/")({
  component: () => <RankingPreviewGrid />,
});
