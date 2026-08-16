import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="conteudo" className="flex-1 pt-16 lg:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  isH1 = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  isH1?: boolean;
}) {
  const TitleTag = isH1 ? "h1" : "h2";
  return (
    <section className="stone-sheet relative isolate overflow-hidden edge-rule-bottom py-14 sm:py-18">
      <span aria-hidden="true" className="topo-lines pointer-events-none absolute inset-0 opacity-70" />
      <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
        {eyebrow ? (
          <span className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-bronze" />
            {eyebrow}
          </span>
        ) : null}
        <TitleTag className="section-title text-bone">{title}</TitleTag>
        <span
          aria-hidden="true"
          className="rule-draw h-[2px] w-28 bg-linear-to-r from-gold via-bronze to-transparent"
        />
        {description ? <p className="body-text max-w-2xl text-parchment/85">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
