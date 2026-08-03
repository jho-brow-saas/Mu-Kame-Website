import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="conteudo" className="flex-1 pt-20">
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
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 py-16 sm:py-20">
      <div className="arcane-veil pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
        {eyebrow ? (
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-jade">{eyebrow}</span>
        ) : null}
        <h1 className="section-title text-ivory">{title}</h1>
        {description ? <p className="body-text max-w-2xl text-mist">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
