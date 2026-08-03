import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/noticias")({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
