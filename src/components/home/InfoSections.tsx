import { SectionHeading, MaterialSection } from "@/components/ui-kit/SectionHeading";
import { StatCard, FeatureCard, PlateHeader } from "@/components/ui-kit/Cards";
import { useSettings } from "@/hooks/use-settings";
import { useServerStatus } from "@/hooks/use-server-status";
import { useRates } from "@/hooks/use-rates";
import { CLASS_LABELS } from "@/lib/normalize-rates";
import { serverConfig, serverHighlights, differentials } from "@/config/server";
import { Crown, Gem, History, Shield, Swords, Trophy, Users, Zap, Coins, Check, X } from "lucide-react";
import { LoadingState, ErrorState } from "@/components/ui-kit/States";

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
            “{settings?.slogan ?? serverConfig.slogan}”
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
  const { data: settings } = useSettings();
  const { data: status } = useServerStatus();
  
  const icons = [Gem, Shield, Crown, Swords, Users, History];
  const serverName = settings?.serverName ?? status?.server?.name ?? serverConfig.name;

  return (
    <MaterialSection material="iron">
      <SectionHeading eyebrow="Informações rápidas" title={`O essencial do ${serverName}`} className="mb-8" />
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
  const { data, isPending, isError, refetch } = useRates();

  const formatVal = (val: number | null | undefined, suffix: string = "") => {
    if (val === null || val === undefined) return "Indisponível";
    return `${val}${suffix}`;
  };

  const formatZen = (val: number | string | null | undefined) => {
    if (val === null || val === undefined) return "Indisponível";
    const num = typeof val === "string" ? parseFloat(val) : val;
    return num.toLocaleString("pt-BR");
  };

  if (isPending) return (
    <MaterialSection material="stone">
      <LoadingState label="Carregando taxas do servidor..." />
    </MaterialSection>
  );

  if (isError) return (
    <MaterialSection material="stone">
      <ErrorState description="Erro ao carregar taxas." onRetry={() => void refetch()} />
    </MaterialSection>
  );

  const publicServers = data.servers.filter(s => 
    !s.name.toLowerCase().includes("teste") && 
    !s.name.toLowerCase().includes("gameservercs")
  );

  return (
    <MaterialSection material="stone">
      <SectionHeading
        eyebrow="Transparência"
        title="Taxas do servidor"
        description="Confira as taxas de experiência e drop configuradas em nossas salas oficiais."
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Tabela de Salas */}
        <div className="flex flex-col gap-6">
          {publicServers.map((server) => (
            <div key={server.name} className="plate plate-cut-slot overflow-hidden">
              <PlateHeader right="sala">{server.name}</PlateHeader>
              <div className="grid grid-cols-2 gap-px bg-gold/10">
                {[
                  { label: "Experiência", value: formatVal(server.normalExp, "x") },
                  { label: "Master EXP", value: formatVal(server.masterExp, "x") },
                  { label: "Drop Itens", value: formatVal(server.itemDrop, "%") },
                  { label: "Drop Zen", value: formatVal(server.zenDrop, "%") },
                ].map((stat) => (
                  <div key={stat.label} className="bg-obsidian/80 p-4">
                    <span className="label-text block text-[0.65rem] text-ash">{stat.label}</span>
                    <span className="data-text text-lg text-gold-soft">{stat.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gold/10 bg-obsidian/40 px-4 py-3">
                <span className="label-text mb-2 block text-[0.65rem] text-ash">Bônus por Nível de Conta</span>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {(["AL0", "AL1", "AL2", "AL3"] as const).map((level) => {
                    const accountLevels = data?.accountLevels || {};
                    const serverAccountLevels = server?.accountLevels || {};

                    const levelData = (serverAccountLevels as any)[level];
                    const isAvailable = server.name?.toLowerCase().includes("vip") ? level !== "AL0" : true;
                    
                    return (
                      <div key={level} className="flex flex-col gap-1">
                        <span className="font-mono text-[0.6rem] text-bone/60">{(accountLevels as any)[level] ?? level}</span>
                        <span className="data-text text-[0.75rem] text-gold">
                          {isAvailable ? formatVal(levelData?.experience, "x") : "Indisponível"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reset e Pontos */}
        <div className="flex flex-col gap-6">
          {/* Reset Info */}
          <div className="plate plate-cut-slot overflow-hidden">
            <PlateHeader right="/reset">Sistema de Reset</PlateHeader>
            <div className="p-5">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-gold/10">
                    <Zap className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <span className="label-text block text-ash">Comando</span>
                    <span className="data-text text-lg text-bone">{data.reset.command}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="label-text block text-ash">Custo</span>
                  <span className="data-text text-lg text-gold-soft">{formatZen(data.reset.zenCost)} Zen</span>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-4">
                {[
                  { label: "Level Necessário", value: data.reset.requiredLevel, icon: Trophy },
                  { label: "Level Pós Reset", value: data.reset.levelAfterReset, icon: History },
                  { label: "Auto Reset", value: data.reset.autoReset, type: "boolean" },
                  { label: "Mantém Skills", value: data.reset.skillsPreserved, type: "boolean" },
                  { label: "Mantém Inventário", value: data.reset.inventoryPreserved, type: "boolean" },
                  { label: "Exige Quest", value: data.reset.questRequired, type: "boolean" },
                ].map((item) => (
                  <li key={item.label} className="flex flex-col gap-1 border-b border-gold/5 pb-2">
                    <span className="label-text text-[0.65rem] text-ash">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.type === "boolean" ? (
                        item.value ? (
                          <Check className="h-4 w-4 text-jade" />
                        ) : (
                          <X className="h-4 w-4 text-crimson" />
                        )
                      ) : (
                        <span className="data-text text-sm text-bone">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Points Info */}
          <div className="plate plate-cut-slot overflow-hidden">
            <PlateHeader right="points">Pontos por Level</PlateHeader>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-px bg-gold/10">
                {Object.entries(data.levelUpPoints).map(([className, points]) => (
                  <div key={className} className="flex items-center justify-between bg-obsidian/80 px-4 py-3">
                    <span className="label-text text-[0.7rem] text-ash">{CLASS_LABELS[className] || className}</span>
                    <span className="data-text text-gold-soft">+{points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {data.notes.length > 0 && (
        <div className="mt-6 space-y-2">
          {data.notes.map((note, idx) => (
            <p key={idx} className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">
              &gt; {note}
            </p>
          ))}
        </div>
      )}
    </MaterialSection>
  );
}

export function DifferentialsSection() {
  const { data: settings } = useSettings();

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
        Season {settings?.season ?? serverConfig.season} · status máximo {(settings?.maxStats ?? serverConfig.maxStats).toLocaleString("pt-BR")} ·{" "}
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
