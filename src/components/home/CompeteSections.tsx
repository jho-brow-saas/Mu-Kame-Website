import { Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { EmptyState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";
import { ActionLink } from "@/components/ui-kit/Buttons";
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
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Rankings"
        title="A disputa começa em 01 de setembro de 2026"
        description="Nenhum jogador foi classificado ainda. Os rankings serão alimentados diretamente pelo servidor após o lançamento."
        className="mb-8"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {previews.map((preview) => (
          <div key={preview.title} className="surface-card flex flex-col gap-4 p-5">
            <h3 className="card-title text-gold-soft">{preview.title}</h3>
            <p className="text-sm leading-relaxed text-mist">
              O ranking começa em breve. Seja um dos primeiros a escrever seu nome na história do MU Kame.
            </p>
            <Link to={preview.to} className="mt-auto text-sm font-semibold text-jade hover:text-jade-glow">
              Acompanhar
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <ActionLink to="/rankings" variant="secondary">
          Ver todos os rankings
        </ActionLink>
      </div>
    </section>
  );
}

export function EventsSection() {
  return (
    <section className="border-y border-white/8 bg-[color:var(--realm)]/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Eventos"
          title="Eventos clássicos e invasões próprias"
          description="O cronograma oficial de horários está em preparação e será divulgado antes do lançamento."
          className="mb-8"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gameEvents.map((event) => (
            <li key={event.name} className="surface-card flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="card-title text-ivory">{event.name}</h3>
                <TagBadge tone={event.type === "Guild" ? "gold" : "jade"}>{event.type}</TagBadge>
              </div>
              <p className="text-sm leading-relaxed text-mist">{event.description}</p>
              <span className="mt-auto flex items-center gap-2 text-xs text-graylight">
                <CalendarClock className="size-3.5" aria-hidden="true" />
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
      </div>
    </section>
  );
}

export function CastleSiegePreview() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="arcane-veil pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">
            <Castle className="size-4" aria-hidden="true" />
            Castle Siege
          </span>
          <h2 className="section-title text-ivory">Nenhuma guild domina este reino ainda.</h2>
          <p className="body-text max-w-xl text-mist">
            A primeira grande batalha do MU Kame será anunciada em breve. Prepare sua guild, organize a defesa e dispute
            o controle do castelo e de seus tributos.
          </p>
          <div>
            <ActionLink to="/castle-siege" variant="secondary">
              Conhecer o Castle Siege
            </ActionLink>
          </div>
        </div>
        <EmptyState
          title="Guild dominante indefinida"
          description={
            serverConfig.castleSiegeSchedule ??
            "Data, horário, guilds inscritas e pontuação aparecerão aqui assim que o cronograma for divulgado."
          }
        />
      </div>
    </section>
  );
}
