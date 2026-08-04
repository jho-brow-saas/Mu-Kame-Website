import { SectionHeading, MaterialSection } from "@/components/ui-kit/SectionHeading";
import { StatCard, FeatureCard, PlateHeader } from "@/components/ui-kit/Cards";
import { serverConfig, serverHighlights, serverRates, differentials } from "@/config/server";
import { Crown, Gem, History, Shield, Swords, Trophy, Users } from "lucide-react";

export function AboutSection() {
  const { data: settings } = useSettings();
  const { data: status } = useServerStatus();
  const serverName = settings?.serverName ?? status?.server?.name ?? serverConfig.name;

  return (
    <MaterialSection material="parchment">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <SectionHeading
            eyebrow="Nossa proposta"
            title="O clássico que marcou uma geração, reconstruído para uma nova era."
            description="MU Kame nasce para recuperar a sensação das antigas Lan Houses, das primeiras guilds e das batalhas que atravessavam a madrugada — agora com uma experiência mais organizada e preparada para uma comunidade competitiva."
          />
          <p className="ceremonial max-w-md text-[1.05rem] leading-relaxed text-gold-soft">
            “{serverConfig.slogan}”
          </p>
        </div>
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
    </MaterialSection>
  );
}

export function QuickInfoSection() {
  const icons = [Gem, Shield, Crown, Swords, Users, History];
  return (
    <MaterialSection material="iron">
      <SectionHeading eyebrow="Informações rápidas" title="O essencial do MU Kame" className="mb-8" />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {serverHighlights.map((item, index) => (
          <li key={item.label}>
            <StatCard label={item.label} value={item.value} icon={icons[index] ?? Gem} accent="gold" />
          </li>
        ))}
      </ul>
    </MaterialSection>
  );
}

export function RatesSection() {
  return (
    <MaterialSection material="stone">
      <SectionHeading
        eyebrow="Transparência"
        title="Taxas do servidor"
        description="A experiência de 1500x corresponde ao VIP Ouro. A conta normal roda em 900x."
        className="mb-8"
      />
      <div className="plate plate-cut-slot overflow-hidden">
        <PlateHeader right="exp / drop">Tabela de taxas</PlateHeader>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Comparativo de experiência e drop por tipo de conta</caption>
          <thead>
            <tr className="border-b border-gold/20 bg-obsidian/50">
              <th scope="col" className="label-text px-4 py-3 text-ash">Conta</th>
              <th scope="col" className="label-text px-4 py-3 text-ash">Experiência</th>
              <th scope="col" className="label-text px-4 py-3 text-ash">Drop</th>
            </tr>
          </thead>
          <tbody>
            {serverRates.map((rate) => (
              <tr key={rate.id} className="border-b border-white/5 last:border-0 hover:bg-bronze-dark/30">
                <th scope="row" className="px-4 py-3 font-ui text-[0.95rem] font-600 uppercase tracking-[0.08em] text-bone">
                  {rate.name}
                </th>
                <td className="data-text px-4 py-3 text-gold-soft">{rate.experience}</td>
                <td className="data-text px-4 py-3 text-arcane">{rate.drop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">
        &gt; taxas podem variar conforme sala, evento ou sistema ativo
      </p>
    </MaterialSection>
  );
}

export function DifferentialsSection() {
  return (
    <MaterialSection material="iron">
      <SectionHeading eyebrow="Diferenciais" title="O que está confirmado no lançamento" className="mb-8" />
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {differentials.map((item, index) => (
          <li
            key={item}
            className="plate plate-cut-soft flex items-center gap-3 px-4 py-3 font-ui text-[0.9rem] uppercase tracking-[0.06em] text-bone transition-colors hover:border-gold/50"
          >
            <span aria-hidden="true" className="data-text text-[0.7rem] text-bronze">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-gold/25" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">
        Season {serverConfig.season} · status máximo {serverConfig.maxStats.toLocaleString("pt-BR")} ·{" "}
        {serverConfig.classesCount} classes
      </p>
    </MaterialSection>
  );
}

/** Faixa de mapa: referência aos mapas impressos e pôsteres de LAN house. */
export function RealmMapStrip() {
  const regions = ["Lorencia", "Noria", "Devias", "Dungeon", "Lost Tower", "Tarkan", "Icarus", "Kanturu"];
  return (
    <MaterialSection material="map">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          eyebrow="Continente"
          title="Um mapa que você já conhece de cor."
          description="Das ruas de Lorencia às ruínas de Kanturu, o traçado clássico permanece — o mesmo caminho, uma nova jornada."
        />
        <ul className="grid grid-cols-2 gap-px border border-gold/20 bg-gold/10 sm:grid-cols-4">
          {regions.map((region) => (
            <li
              key={region}
              className="bg-obsidian/80 px-3 py-4 text-center font-mono text-[0.72rem] uppercase tracking-[0.16em] text-parchment/80 transition-colors hover:bg-bronze-dark/60 hover:text-gold-soft"
            >
              {region}
            </li>
          ))}
        </ul>
      </div>
    </MaterialSection>
  );
}
