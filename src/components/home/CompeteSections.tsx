import { Link } from "@tanstack/react-router";
import { SectionHeading, MaterialSection } from "@/components/ui-kit/SectionHeading";
import { EmptyState } from "@/components/ui-kit/States";
import { TagBadge, PlateHeader } from "@/components/ui-kit/Cards";
import { ActionLink, BracketLink } from "@/components/ui-kit/Buttons";
import { gameEvents, serverConfig } from "@/config/server";
import { Castle, CalendarClock } from "lucide-react";

const previews = [
  { title: "Top Reset", to: "/rankings/reset" },
  { title: "Top Master Reset", to: "/rankings/master-reset" },
  { title: "Top PK", to: "/rankings/pk" },
  { title: "Top Guild", to: "/rankings/guilds" },
] as const;

export function RankingPreviewSection() {
  return (
    <MaterialSection material="iron">
      <SectionHeading
        eyebrow="Rankings"
        title="A disputa começa em 01 de setembro de 2026"
        description="Nenhum jogador foi classificado ainda. Os rankings serão alimentados diretamente pelo servidor após o lançamento."
        className="mb-8"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {previews.map((preview, index) => (
          <div key={preview.title} className="plate plate-cut-slot flex flex-col">
            <PlateHeader right={`#${String(index + 1).padStart(2, "0")}`}>{preview.title}</PlateHeader>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <p className="text-sm leading-relaxed text-parchment/80">
                Aguardando os primeiros nomes gravados na história do MU Kame.
              </p>
              <BracketLink to={preview.to} className="mt-auto">
                Acompanhar
              </BracketLink>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <ActionLink to="/rankings" variant="secondary">
          Ver todos os rankings
        </ActionLink>
      </div>
    </MaterialSection>
  );
}

export function EventsSection() {
  return (
    <MaterialSection material="parchment">
      <SectionHeading
        eyebrow="Eventos"
        title="Eventos clássicos e invasões próprias"
        description="O cronograma oficial de horários está em preparação e será divulgado antes do lançamento."
        className="mb-8"
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gameEvents.map((event) => (
          <li key={event.name} className="plate plate-cut-soft flex flex-col gap-3 p-5 hover:border-gold/50">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <h3 className="card-title min-w-0 uppercase text-bone">{event.name}</h3>
              <span className="shrink-0">
                <TagBadge tone={event.type === "Guild" ? "gold" : "jade"}>{event.type}</TagBadge>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-parchment/80">{event.description}</p>
            <span className="mt-auto flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ash">
              <CalendarClock className="size-3.5 shrink-0 text-bronze" aria-hidden="true" />
              Cronograma em preparação
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <ActionLink to="/eventos" variant="secondary">
          Ver todos os eventos
        </ActionLink>
      </div>
    </MaterialSection>
  );
}

export function CastleSiegePreview() {
  return (
    <MaterialSection material="fortress">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-crimson">
            <Castle className="size-4 shrink-0" aria-hidden="true" />
            Castle Siege
          </span>
          <h2 className="section-title text-bone">Nenhuma guild domina este reino ainda.</h2>
          <span aria-hidden="true" className="rule-draw h-[2px] w-28 bg-linear-to-r from-crimson via-wine to-transparent" />
          <p className="body-text max-w-xl text-parchment/85">
            A primeira grande batalha do MU Kame será anunciada em breve. Prepare sua guild, organize a defesa e dispute
            o controle do castelo e de seus tributos.
          </p>
          <div>
            <ActionLink to="/castle-siege" variant="secondary">
              Conhecer o Castle Siege
            </ActionLink>
          </div>
        </div>
        <div className="relative">
          <span
            aria-hidden="true"
            className="seal-in absolute -top-4 right-2 z-10 border border-crimson/60 bg-wine/70 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone"
          >
            Trono vago
          </span>
          <EmptyState
            title="Guild dominante indefinida"
            description={
              serverConfig.castleSiegeSchedule ??
              "Data, horário, guilds inscritas e pontuação aparecerão aqui assim que o cronograma for divulgado."
            }
          />
        </div>
      </div>
    </MaterialSection>
  );
}

/** Faixa de guildas: portais de guild eram o coração social do MU em 2003. */
export function GuildCallSection() {
  return (
    <MaterialSection material="stone">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <SectionHeading
          eyebrow="Guilds"
          title="Reúna os antigos. Recrute os novos."
          description="Estandarte, hierarquia, alianças e guerra territorial. O sistema de guilds estará ativo desde o primeiro dia."
        />
        <Link
          to="/cadastro"
          className="btn-cut bronze-sheet inline-flex min-h-[46px] items-center justify-center border border-gold/55 px-6 font-ui text-[0.82rem] font-700 uppercase tracking-[0.16em] text-bone hover:border-gold hover:text-gold-soft"
        >
          Fundar minha guild
        </Link>
      </div>
    </MaterialSection>
  );
}
