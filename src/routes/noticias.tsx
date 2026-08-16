import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias — MU Kame" },
      { name: "description", content: "Acompanhe as últimas notícias, eventos e atualizações do servidor MU Kame." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
