import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/SiteLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";
import { useNews } from "@/hooks/use-news";
import { excerpt, formatBrDate } from "@/lib/mukame-format";

const title = "Notícias — MU Kame";
const description = "Comunicados oficiais, atualizações, manutenções e eventos do servidor MU Kame.";

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/noticias" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/noticias" }],
  }),
  component: NoticiasPage,
});

function NoticiasPage() {
  const { data, isPending, isError, refetch } = useNews(12);
  const items = data?.items ?? [];

  return (
    <>
      <PageHero
        eyebrow="Comunicados"
        title="Notícias do MU Kame"
        description="Atualizações, manutenções e comunicados oficiais da equipe."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isPending ? <LoadingState label="Carregando comunicados…" /> : null}
        {isError ? (
          <ErrorState
            description="Não foi possível carregar os comunicados agora."
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isPending && !isError && items.length === 0 ? (
          <EmptyState
            title="Nada publicado ainda"
            description="Os primeiros comunicados do MU Kame serão publicados em breve."
          />
        ) : null}
        {items.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const published = formatBrDate(item.publishedAt);
              return (
                <li key={item.id} className="surface-card flex flex-col gap-3 p-5">
                  {published ? <TagBadge tone="muted">{published}</TagBadge> : null}
                  <h2 className="card-title text-ivory">{item.title}</h2>
                  <p className="line-clamp-3 text-sm text-mist">{excerpt(item.content)}</p>
                  <Link
                    to="/noticias/$slug"
                    params={{ slug: String(item.id) }}
                    className="mt-auto text-sm font-semibold text-gold hover:text-gold-soft"
                  >
                    Ler comunicado
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
    </>
  );
}
