import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { TagBadge } from "@/components/ui-kit/Cards";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { useEvents } from "@/hooks/use-events";
import { eventCategoryLabel, isGuildCategory } from "@/lib/mukame-format";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

const filters = [
  { id: "all", label: "Todos" },
  { id: "classic", label: "Eventos clássicos" },
  { id: "invasion", label: "Invasões" },
  { id: "pvp", label: "Eventos PvP" },
  { id: "guild", label: "Eventos de guild" },
  { id: "custom", label: "Personalizados" },
] as const;

type FilterId = (typeof filters)[number]["id"];

const title = "Eventos — MU Kame";
const description = "Blood Castle, Devil Square, Chaos Castle, invasões e eventos personalizados do MU Kame. Cronograma em preparação.";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/eventos" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/eventos" }],
  }),
  component: EventosPage,
});

function EventosPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const { data, isPending, isError, refetch } = useEvents();
  const items = data?.items ?? [];

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((event) => event.category === filter)),
    [items, filter],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Eventos"
        title="Eventos e invasões"
        description="Os horários oficiais são publicados pela API do servidor. Nenhum cronograma é inventado aqui."
        isH1={true}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {items.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar eventos">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={cn(
                  "min-h-[44px] border px-4 text-sm transition-colors",
                  filter === item.id
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-white/10 text-mist hover:text-ivory",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}

        {isPending ? <LoadingState label="Carregando eventos…" /> : null}
        {isError ? (
          <ErrorState description="Não foi possível carregar os eventos agora." onRetry={() => void refetch()} />
        ) : null}
        {!isPending && !isError && visible.length === 0 ? (
          <EmptyState
            title="Nenhum evento nesta categoria"
            description="A lista oficial de eventos será ampliada antes do lançamento."
          />
        ) : null}

        {visible.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((event) => (
              <li key={event.id} className="surface-card flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="card-title text-ivory">{event.name}</h2>
                  <TagBadge tone={isGuildCategory(event.category) ? "gold" : "jade"}>
                    {eventCategoryLabel(event.category)}
                  </TagBadge>
                </div>
                <span className="mt-auto flex items-center gap-2 text-xs text-graylight">
                  <CalendarClock className="size-3.5" aria-hidden="true" />
                  {event.schedule ?? "Cronograma em preparação"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </SiteLayout>
  );
}
