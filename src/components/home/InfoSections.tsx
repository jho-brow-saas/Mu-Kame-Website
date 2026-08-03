import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { StatCard, FeatureCard } from "@/components/ui-kit/Cards";
import { serverConfig, serverHighlights, serverRates, differentials } from "@/config/server";
import { Crown, Gem, History, Shield, Swords, Trophy, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading
          eyebrow="Nossa proposta"
          title="O clássico que marcou uma geração, reconstruído para uma nova era."
          description="MU Kame nasce para recuperar a sensação das antigas Lan Houses, das primeiras guilds e das batalhas que atravessavam a madrugada — agora com uma experiência mais moderna, organizada e preparada para uma comunidade competitiva."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Nostalgia", description: "A essência do MU dos anos 2000 preservada com fidelidade.", icon: History },
            { title: "Progressão", description: "Reset, Master Reset e Master Level 400 com curva equilibrada.", icon: Trophy },
            { title: "PvP", description: "Salas dedicadas, Chaos Castle e disputa constante por território.", icon: Swords },
            { title: "Comunidade", description: "Guilds brasileiras, suporte próximo e eventos recorrentes.", icon: Users },
          ].map((item) => (
            <li key={item.title}>
              <FeatureCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function QuickInfoSection() {
  const icons = [Gem, Shield, Crown, Swords, Users, History];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Informações rápidas" title="O essencial do MU Kame" className="mb-8" />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {serverHighlights.map((item, index) => (
          <li key={item.label}>
            <StatCard label={item.label} value={item.value} icon={icons[index] ?? Gem} />
          </li>
        ))}

      </ul>
    </section>
  );
}

export function RatesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Transparência"
        title="Taxas do servidor"
        description="A experiência de 1500x corresponde ao VIP Ouro. A conta normal roda em 900x."
        className="mb-8"
      />
      <div className="surface-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Comparativo de experiência e drop por tipo de conta</caption>
          <thead>
            <tr className="border-b border-white/8 text-[0.65rem] uppercase tracking-[0.2em] text-graylight">
              <th scope="col" className="px-5 py-4 font-semibold">Conta</th>
              <th scope="col" className="px-5 py-4 font-semibold">Experiência</th>
              <th scope="col" className="px-5 py-4 font-semibold">Drop</th>
            </tr>
          </thead>
          <tbody>
            {serverRates.map((rate) => (
              <tr key={rate.id} className="border-b border-white/5 last:border-0">
                <th scope="row" className="px-5 py-4 font-display text-base font-normal text-ivory">{rate.name}</th>
                <td className="px-5 py-4 text-jade">{rate.experience}</td>
                <td className="px-5 py-4 text-gold-soft">{rate.drop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-graylight">
        As taxas podem variar conforme sala, evento ou sistema ativo.
      </p>
    </section>
  );
}

export function DifferentialsSection() {
  return (
    <section className="border-y border-white/8 bg-[color:var(--realm)]/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Diferenciais" title="O que está confirmado no lançamento" className="mb-8" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item) => (
            <li
              key={item}
              className="surface-card flex items-center gap-3 px-5 py-4 text-sm text-ivory transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-jade" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-graylight">
          Season {serverConfig.season} • Status máximo {serverConfig.maxStats.toLocaleString("pt-BR")} •{" "}
          {serverConfig.classesCount} classes disponíveis
        </p>
      </div>
    </section>
  );
}
