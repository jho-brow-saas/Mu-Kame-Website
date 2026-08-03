import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/SiteLayout";
import { EmptyState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";
import { api, type NewsItem } from "@/services/api";

export const Route = createFileRoute("/noticias/$slug")({
  head: () => ({
    meta: [
      { title: "Comunicado — MU Kame" },
      { name: "description", content: "Comunicado oficial publicado pela equipe do MU Kame." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: NoticiaDetalhe,
});

function NoticiaDetalhe() {
  const { slug } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getNews()
      .then((items) => {
        if (!active) return;
        setItem(items.find((entry) => entry.slug === slug) ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <LoadingState label="Carregando comunicado…" />
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

  return (
    <>
      <PageHero eyebrow="Comunicado" title={item.subject} />
      <article className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <TagBadge tone="muted">{item.category}</TagBadge>
          <time className="text-xs text-graylight" dateTime={item.date}>
            {new Date(item.date).toLocaleDateString("pt-BR")}
          </time>
        </div>
        <p className="body-text whitespace-pre-line text-mist">{item.content}</p>
        <Link to="/noticias" className="text-sm font-semibold text-gold hover:text-gold-soft">
          Voltar para notícias
        </Link>
      </article>
    </>
  );
}
