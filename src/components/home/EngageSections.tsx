import { useEffect, useState } from "react";
import { SectionHeading, MaterialSection } from "@/components/ui-kit/SectionHeading";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge, PlateHeader } from "@/components/ui-kit/Cards";
import { ActionAnchor, ActionLink, BracketLink } from "@/components/ui-kit/Buttons";
import { VipPlansGrid } from "@/components/vip/VipPlansGrid";
import { api, type NewsItem } from "@/services/api";
import { serverConfig, whatsappLink, faqItems } from "@/config/server";
import { Download, Instagram, MessageCircle, Music2, Smartphone } from "lucide-react";

export function VipSection() {
  return (
    <MaterialSection material="iron">
      <SectionHeading
        eyebrow="VIP"
        title="Insígnias VIP"
        description="Assinaturas de 30 dias com experiência e drop ampliados. Os benefícios complementares serão divulgados antes do lançamento."
        className="mb-8"
      />
      <VipPlansGrid />
      <div className="mt-8">
        <ActionLink to="/vip" variant="secondary">
          Ver planos VIP
        </ActionLink>
      </div>
    </MaterialSection>
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
    <MaterialSection material="parchment">
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
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <li key={item.slug} className="plate plate-cut-soft flex flex-col gap-3 p-5 hover:border-gold/50">
              <TagBadge tone="muted">{item.category}</TagBadge>
              <h3 className="card-title uppercase text-bone">{item.subject}</h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-parchment/80">{item.content}</p>
              <BracketLink to="/noticias/$slug" params={{ slug: item.slug }} className="mt-auto">
                Ler comunicado
              </BracketLink>
            </li>
          ))}
        </ul>
      ) : null}
    </MaterialSection>
  );
}

export function DownloadsSection() {
  return (
    <MaterialSection material="launcher">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading
          eyebrow="Downloads"
          title="Prepare-se para entrar no continente."
          description="Cliente completo para Windows, patch de atualização e uma versão Android em desenvolvimento."
        />
        <div className="plate plate-cut-slot overflow-hidden">
          <PlateHeader right="win32">Instalação</PlateHeader>
          <div className="flex flex-col gap-3 p-5">
            <ActionAnchor href={serverConfig.pcDownloadUrl}>
              <Download className="size-4" aria-hidden="true" />
              Baixar cliente PC
            </ActionAnchor>
            <ActionAnchor href={serverConfig.patchDownloadUrl} variant="secondary">
              <Download className="size-4" aria-hidden="true" />
              Baixar patch
            </ActionAnchor>
            <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">
              <Smartphone className="size-4 shrink-0 text-bronze" aria-hidden="true" />
              versão android em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </MaterialSection>
  );
}

export function CommunitySection() {
  return (
    <MaterialSection material="stone">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading
          eyebrow="Comunidade e suporte"
          title="Precisa de ajuda?"
          description="Nossa equipe de suporte está disponível pelo WhatsApp oficial."
        />
        <div className="plate plate-cut-slot overflow-hidden">
          <PlateHeader right="24h">Canais oficiais</PlateHeader>
          <div className="flex flex-col gap-3 p-5">
            <ActionAnchor href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              {serverConfig.supportWhatsAppLabel}
            </ActionAnchor>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ActionAnchor
                href={serverConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                className="flex-1"
              >
                <Instagram className="size-4" aria-hidden="true" />
                Instagram {serverConfig.socialHandle}
              </ActionAnchor>
              <ActionAnchor
                href={serverConfig.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                className="flex-1"
              >
                <Music2 className="size-4" aria-hidden="true" />
                TikTok {serverConfig.socialHandle}
              </ActionAnchor>
            </div>
          </div>
        </div>
      </div>
    </MaterialSection>
  );
}

export function FaqSection() {
  return (
    <MaterialSection material="iron">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" align="center" className="mb-8" />
        <div className="flex flex-col gap-2">
          {faqItems.map((item, index) => (
            <details key={item.q} className="plate plate-cut-soft group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-ui text-[0.95rem] font-600 uppercase tracking-[0.06em] text-bone marker:hidden">
                <span aria-hidden="true" className="data-text text-[0.7rem] text-bronze">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-4 w-px bg-gold/25" />
                {item.q}
              </summary>
              <p className="mt-3 border-t border-gold/15 pt-3 text-sm leading-relaxed text-parchment/85">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </MaterialSection>
  );
}

export function FinalCta() {
  return (
    <section className="fortress-sheet relative isolate overflow-hidden edge-rule-top py-20">
      <span aria-hidden="true" className="rune-grid pointer-events-none absolute inset-0 opacity-60" />
      <span aria-hidden="true" className="grain-layer dust-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-gold">Convocação</span>
        <h2 className="hero-title text-[clamp(1.8rem,4vw,3rem)] text-bone">
          A próxima lenda <span className="gold-gradient-text">pode ser você.</span>
        </h2>
        <p className="body-text text-parchment/85">
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
