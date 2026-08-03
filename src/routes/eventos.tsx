import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { TagBadge } from "@/components/ui-kit/Cards";
import { gameEvents, type GameEvent } from "@/config/server";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

const filters: Array<{ id: "all" | GameEvent["type"]; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "Clássico", label: "Eventos clássicos" },
  { id: "Invasão", label: "Invasões" },
  { id: "PvP", label: "Eventos PvP" },
  { id: "Guild", label: "Eventos de guild" },
  { id: "Personalizado", label: "Personalizados" },
];

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
  const [filter, setFilter] = useState<"all" | GameEvent["type"]>("all");
  const visible = filter === "all" ? gameEvents : gameEvents.filter((event) => event.type === filter);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Eventos"
        title="Eventos e invasões"
        description="Os horários oficiais serão divulgados antes do lançamento. Nenhum cronograma foi definido ainda."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <li key={event.name} className="surface-card flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="card-title text-ivory">{event.name}</h2>
                <TagBadge tone={event.type === "Guild" ? "gold" : "jade"}>{event.type}</TagBadge>
              </div>
              <p className="text-sm leading-relaxed text-mist">{event.description}</p>
              <span className="mt-auto flex items-center gap-2 text-xs text-graylight">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                Horário a definir
              </span>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
