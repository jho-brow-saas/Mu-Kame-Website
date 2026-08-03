import { Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { rankingTabs } from "@/routes/rankings";

const cards = rankingTabs.filter((tab) => !("exact" in tab));

export function RankingPreviewGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Visão geral"
        title="Escolha uma classificação"
        description="Nenhum jogador foi classificado ainda. A disputa começa em 01 de setembro de 2026."
        className="mb-8"
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.to}>
            <Link
              to={card.to}
              className="surface-card flex min-h-[104px] flex-col justify-between p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-gold/25"
            >
              <span className="card-title font-display text-ivory">{card.label}</span>
              <span className="text-xs text-graylight">Ranking em preparação</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
