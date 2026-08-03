import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/SiteLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";
import { api, type NewsItem } from "@/services/api";

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
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    let active = true;
    api
      .getNews()
      .then((items) => {
        if (!active) return;
        setNews(items);
        setState("ready");
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Comunicados"
        title="Notícias do MU Kame"
        description="Atualizações, manutenções e comunicados oficiais da equipe."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {state === "loading" ? <LoadingState label="Carregando comunicados…" /> : null}
        {state === "error" ? <ErrorState description="Não foi possível carregar os comunicados agora." /> : null}
        {state === "ready" && news.length === 0 ? (
          <EmptyState
            title="Nada publicado ainda"
            description="Os primeiros comunicados do MU Kame serão publicados em breve."
          />
        ) : null}
        {state === "ready" && news.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <li key={item.slug} className="surface-card flex flex-col gap-3 p-5">
                <TagBadge tone="muted">{item.category}</TagBadge>
                <h2 className="card-title text-ivory">{item.subject}</h2>
                <p className="line-clamp-3 text-sm text-mist">{item.content}</p>
                <Link
                  to="/noticias/$slug"
                  params={{ slug: item.slug }}
                  className="mt-auto text-sm font-semibold text-jade hover:text-jade-glow"
                >
                  Ler comunicado
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </>
  );
}
