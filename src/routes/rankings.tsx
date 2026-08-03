import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";

export const rankingTabs = [
  { to: "/rankings", label: "Visão geral", exact: true },
  { to: "/rankings/reset", label: "Reset" },
  { to: "/rankings/master-reset", label: "Master Reset" },
  { to: "/rankings/level", label: "Level" },
  { to: "/rankings/master-level", label: "Master Level" },
  { to: "/rankings/pk", label: "PK" },
  { to: "/rankings/kills", label: "Kills" },
  { to: "/rankings/semanal", label: "Semanal" },
  { to: "/rankings/mensal", label: "Mensal" },
  { to: "/rankings/guilds", label: "Guilds" },
  { to: "/rankings/blood-castle", label: "Blood Castle" },
  { to: "/rankings/devil-square", label: "Devil Square" },
  { to: "/rankings/chaos-castle", label: "Chaos Castle" },
  { to: "/rankings/classes", label: "Por classe" },
] as const;

const title = "Rankings — MU Kame";
const description =
  "Rankings do MU Kame: reset, master reset, level, PK, kills, guilds, eventos e classificações semanais e mensais.";

export const Route = createFileRoute("/rankings")({
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
  component: RankingsLayout,
});

function RankingsLayout() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Classificações"
        title="Rankings do MU Kame"
        description="Todos os rankings serão alimentados diretamente pelo servidor após o lançamento em 01 de setembro de 2026."
      />
      <nav aria-label="Categorias de ranking" className="metal-sheet edge-rule-bottom">
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {rankingTabs.map((tab) => (
            <li key={tab.to}>
              <Link
                to={tab.to}
                activeOptions={{ exact: "exact" in tab }}
                className="inline-flex min-h-[44px] shrink-0 items-center border border-white/10 px-4 text-sm text-mist transition-colors hover:text-ivory data-[status=active]:border-gold/40 data-[status=active]:bg-gold/10 data-[status=active]:text-gold"
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </SiteLayout>
  );
}
