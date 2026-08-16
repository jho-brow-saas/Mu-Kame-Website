import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/SiteLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";
import { useNews } from "@/hooks/use-news";
import { formatBrDate, parseApiDate, toPlainText } from "@/lib/mukame-format";
import { muKameApi } from "@/services/mukame-api";

export const Route = createFileRoute("/noticias/$slug")({
  loader: async ({ params }) => {
    // Carregamos a notícia no loader para ter o título disponível no head()
    const data = await muKameApi.news(50); // Pegamos um range maior para garantir o slug
    const item = data?.items.find((entry) => String(entry.id) === params.slug) ?? null;
    return { item };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.item ? `${loaderData.item.title} — MU Kame` : "Comunicado — MU Kame";
    const description = loaderData?.item 
      ? toPlainText(loaderData.item.content).slice(0, 155) + "..."
      : "Comunicado oficial publicado pela equipe do MU Kame.";
      
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: NoticiaDetalhe,
});

function NoticiaDetalhe() {
  const { item } = Route.useLoaderData();
  const { isPending, isError, refetch } = useNews(30);
  // O item agora vem do loader para hidratação imediata e SEO


  if (isPending) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <LoadingState label="Carregando comunicado…" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <ErrorState
          description="Não foi possível carregar este comunicado agora."
          onRetry={() => void refetch()}
        />
      </section>
    );
  }

  if (!item) {
    return (
      <>
        <PageHero eyebrow="Comunicado" title="Comunicado indisponível" />
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <EmptyState
            title="Este comunicado ainda não existe"
            description="Os primeiros comunicados do MU Kame serão publicados em breve."
            action={
              <Link to="/noticias" className="text-sm font-semibold text-gold hover:text-gold-soft">
                Voltar para notícias
              </Link>
            }
          />
        </section>
      </>
    );
  }

  const published = formatBrDate(item.publishedAt);
  const publishedIso = parseApiDate(item.publishedAt)?.toISOString();

  return (
    <>
      <PageHero eyebrow="Comunicado" title={item.title} />
      <article className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6">
        {published ? (
          <div className="flex items-center gap-3">
            <TagBadge tone="muted">Comunicado</TagBadge>
            <time className="text-xs text-graylight" dateTime={publishedIso}>
              {published}
            </time>
          </div>
        ) : null}
        <p className="body-text whitespace-pre-line text-mist">{toPlainText(item.content)}</p>
        <Link to="/noticias" className="text-sm font-semibold text-gold hover:text-gold-soft">
          Voltar para notícias
        </Link>
      </article>
    </>
  );
}
