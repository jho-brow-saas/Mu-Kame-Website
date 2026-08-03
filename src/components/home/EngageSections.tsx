import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";
import { ActionAnchor, ActionLink, ghostClasses } from "@/components/ui-kit/Buttons";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { VipPlansGrid } from "@/components/vip/VipPlansGrid";
import { api, type NewsItem } from "@/services/api";
import { serverConfig, whatsappLink, faqItems } from "@/config/server";
import { Download, Instagram, MessageCircle, Music2, Smartphone } from "lucide-react";

export function VipSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="VIP"
        title="Planos VIP"
        description="Assinaturas de 30 dias com experiência e drop ampliados. Os benefícios complementares serão divulgados antes do lançamento."
        className="mb-8"
      />
      <VipPlansGrid />
      <div className="mt-8">
        <ActionLink to="/vip" variant="secondary">
          Ver planos VIP
        </ActionLink>
      </div>
    </section>
  );
}

export function NewsSection() {
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
    <section className="border-y border-white/8 bg-[color:var(--realm)]/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Notícias" title="Comunicados oficiais" className="mb-8" />
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
                <h3 className="card-title text-ivory">{item.subject}</h3>
                <p className="line-clamp-3 text-sm text-mist">{item.content}</p>
                <Link
                  to="/noticias/$slug"
                  params={{ slug: item.slug }}
                  className={cn(ghostClasses, "mt-auto")}
                >
                  Ler comunicado
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function DownloadsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading
          eyebrow="Downloads"
          title="Prepare-se para entrar no continente."
          description="Cliente completo para Windows, patch de atualização e uma versão Android em desenvolvimento."
        />
        <div className="surface-card flex flex-col gap-4 p-6">
          <ActionAnchor href={serverConfig.pcDownloadUrl}>
            <Download className="size-4" aria-hidden="true" />
            Baixar cliente PC
          </ActionAnchor>
          <ActionAnchor href={serverConfig.patchDownloadUrl} variant="secondary">
            <Download className="size-4" aria-hidden="true" />
            Baixar patch
          </ActionAnchor>
          <p className="flex items-center gap-2 text-sm text-graylight">
            <Smartphone className="size-4" aria-hidden="true" />
            Versão Android em desenvolvimento.
          </p>
        </div>
      </div>
    </section>
  );
}

export function CommunitySection() {
  return (
    <section className="border-y border-white/8 bg-[color:var(--realm)]/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
        <SectionHeading
          eyebrow="Comunidade e suporte"
          title="Precisa de ajuda?"
          description="Nossa equipe de suporte está disponível pelo WhatsApp oficial."
        />
        <div className="surface-card flex flex-col gap-4 p-6">
          <ActionAnchor href={whatsappLink} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" aria-hidden="true" />
            {serverConfig.supportWhatsAppLabel}
          </ActionAnchor>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionAnchor href={serverConfig.instagramUrl} target="_blank" rel="noreferrer" variant="ghost" className="flex-1">
              <Instagram className="size-4" aria-hidden="true" />
              Instagram {serverConfig.socialHandle}
            </ActionAnchor>
            <ActionAnchor href={serverConfig.tiktokUrl} target="_blank" rel="noreferrer" variant="ghost" className="flex-1">
              <Music2 className="size-4" aria-hidden="true" />
              TikTok {serverConfig.socialHandle}
            </ActionAnchor>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" align="center" className="mb-8" />
      <div className="flex flex-col gap-3">
        {faqItems.map((item) => (
          <details key={item.q} className="surface-card group px-5 py-4">
            <summary className="cursor-pointer list-none font-display text-base text-ivory marker:hidden">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-mist">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="arcane-veil pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="section-title text-ivory">A próxima lenda pode ser você.</h2>
        <p className="body-text text-mist">
          Prepare sua guild, escolha sua classe e esteja presente desde o primeiro minuto.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionLink to="/cadastro">Criar conta</ActionLink>
          <ActionAnchor href={serverConfig.pcDownloadUrl} variant="secondary">
            Baixar cliente
          </ActionAnchor>
        </div>
      </div>
    </section>
  );
}
