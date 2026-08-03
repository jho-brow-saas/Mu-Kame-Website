import { Link } from "@tanstack/react-router";
import { SectionHeading, MaterialSection } from "@/components/ui-kit/SectionHeading";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { TagBadge, PlateHeader } from "@/components/ui-kit/Cards";
import { ActionLink, BracketLink } from "@/components/ui-kit/Buttons";
import { useEvents } from "@/hooks/use-events";
import { useCastleSiege } from "@/hooks/use-castle-siege";
import { useRankings } from "@/hooks/use-rankings";
import { eventCategoryLabel, formatBrDateTime, isGuildCategory } from "@/lib/mukame-format";
import type { RankingType } from "@/types/mukame-api";
import { Castle, CalendarClock } from "lucide-react";

const previews: Array<{ title: string; to: string; type: RankingType }> = [
  { title: "Top Reset", to: "/rankings/reset", type: "reset" },
  { title: "Top Master Reset", to: "/rankings/master-reset", type: "master-reset" },
  { title: "Top PK", to: "/rankings/pk", type: "pk" },
  { title: "Top Guild", to: "/rankings/guilds", type: "guilds" },
];

function RankingPreviewCard({
  title,
  to,
  type,
  index,
}: {
  title: string;
  to: string;
  type: RankingType;
  index: number;
}) {
  const { data, isPending, isError } = useRankings(type, 3);
  const items = data?.items ?? [];

  return (
    <div className="plate plate-cut-slot flex flex-col">
      <PlateHeader right={`#${String(index + 1).padStart(2, "0")}`}>{title}</PlateHeader>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {isPending ? (
          <span className="h-4 w-3/4 animate-pulse bg-bronze-dark/60" aria-hidden="true" />
        ) : isError ? (
          <p className="text-sm leading-relaxed text-parchment/80">
            Classificação indisponível no momento.
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm leading-relaxed text-parchment/80">
            {data?.message ?? "Aguardando os primeiros nomes gravados na história do MU Kame."}
          </p>
        ) : (
          <ol className="flex flex-col gap-1">
            {items.slice(0, 3).map((item, position) => (
              <li
                key={`${item.name ?? item.guild ?? position}`}
                className="flex items-baseline justify-between gap-3 font-mono text-[0.72rem] uppercase tracking-[0.1em]"
              >
                <span className="text-gold">{String(item.position ?? position + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate text-bone">
                  {item.name ?? item.guild ?? item.guildName ?? "—"}
                </span>
              </li>
            ))}
          </ol>
        )}
        <BracketLink to={to} className="mt-auto">
          Acompanhar
        </BracketLink>
      </div>
    </div>
  );
}

export function RankingPreviewSection() {
  const { data } = useRankings("reset", 10);
  const releaseMessage =
    data && data.items.length === 0
      ? (data.message ?? "A disputa começa em 01 de setembro de 2026.")
      : "Os rankings são alimentados diretamente pelo servidor oficial.";

  return (
    <MaterialSection material="iron">
      <SectionHeading
        eyebrow="Rankings"
        title="A disputa começa em 01 de setembro de 2026"
        description={releaseMessage}
        className="mb-8"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {previews.map((preview, index) => (
          <RankingPreviewCard key={preview.title} {...preview} index={index} />
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
  const { data, isPending, isError, refetch } = useEvents();
  const items = data?.items ?? [];

  return (
    <MaterialSection material="parchment">
      <SectionHeading
        eyebrow="Eventos"
        title="Eventos clássicos e invasões próprias"
        description="O cronograma oficial de horários é publicado pela API do servidor."
        className="mb-8"
      />

      {isPending ? <LoadingState label="Carregando eventos…" /> : null}
      {isError ? (
        <ErrorState description="Não foi possível carregar os eventos agora." onRetry={() => void refetch()} />
      ) : null}
      {!isPending && !isError && items.length === 0 ? (
        <EmptyState
          title="Nenhum evento publicado"
          description="A lista oficial de eventos será divulgada antes do lançamento."
        />
      ) : null}

      {items.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((event) => (
            <li key={event.id} className="plate plate-cut-soft flex flex-col gap-3 p-5 hover:border-gold/50">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <h3 className="card-title min-w-0 uppercase text-bone">{event.name}</h3>
                <span className="shrink-0">
                  <TagBadge tone={isGuildCategory(event.category) ? "gold" : "jade"}>
                    {eventCategoryLabel(event.category)}
                  </TagBadge>
                </span>
              </div>
              <span className="mt-auto flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ash">
                <CalendarClock className="size-3.5 shrink-0 text-bronze" aria-hidden="true" />
                {event.schedule ?? "Cronograma em preparação"}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8">
        <ActionLink to="/eventos" variant="secondary">
          Ver todos os eventos
        </ActionLink>
      </div>
    </MaterialSection>
  );
}

export function CastleSiegePreview() {
  const { data, isPending, isError, refetch } = useCastleSiege();
  const siege = data?.configured ? (data.castleSiege ?? null) : null;
  const owner = siege?.ownerGuild?.trim() ? siege.ownerGuild.trim() : null;
  const start = formatBrDateTime(siege?.startDate ?? null);
  const end = formatBrDateTime(siege?.endDate ?? null);

  return (
    <MaterialSection material="fortress">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-crimson">
            <Castle className="size-4 shrink-0" aria-hidden="true" />
            Castle Siege
          </span>
          <h2 className="section-title text-bone">
            {owner ? `${owner} domina o castelo.` : "Nenhuma guild domina este reino ainda."}
          </h2>
          <span aria-hidden="true" className="rule-draw h-[2px] w-28 bg-linear-to-r from-crimson via-wine to-transparent" />
          <p className="body-text max-w-xl text-parchment/85">
            {owner
              ? "Reúna sua guild, organize o cerco e dispute o controle do castelo e de seus tributos."
              : "A primeira grande batalha do MU Kame será anunciada em breve. Prepare sua guild, organize a defesa e dispute o controle do castelo e de seus tributos."}
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
            {owner ? "Trono ocupado" : "Trono vago"}
          </span>

          {isPending ? (
            <LoadingState label="Consultando o castelo…" />
          ) : isError ? (
            <ErrorState
              description="Não foi possível consultar o Castle Siege agora."
              onRetry={() => void refetch()}
            />
          ) : !data?.configured ? (
            <EmptyState
              title="Castle Siege ainda não configurado"
              description="Data, horário e guild dominante aparecerão aqui assim que o cronograma for divulgado."
            />
          ) : (
            <div className="plate plate-cut-slot overflow-hidden">
              <PlateHeader right="castle_siege">Estado do castelo</PlateHeader>
              <ul className="flex flex-col divide-y divide-gold/10">
                {[
                  { label: "Guild dominante", value: owner ?? "Indefinida" },
                  { label: "Início", value: start ?? "A definir" },
                  { label: "Término", value: end ?? "A definir" },
                ].map((row) => (
                  <li key={row.label} className="flex items-baseline justify-between gap-3 px-4 py-3">
                    <span className="label-text text-ash">{row.label}</span>
                    <span className="data-text text-sm text-gold-soft">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
