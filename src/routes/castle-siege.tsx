import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { EmptyState } from "@/components/ui-kit/States";
import { StatCard } from "@/components/ui-kit/Cards";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { api, type CastleSiegeState } from "@/services/api";
import { Castle, Coins, DoorClosed, Flag, Shield, Users } from "lucide-react";

const title = "Castle Siege — MU Kame";
const description = "Guild dominante, cronograma, guilds inscritas e status do castelo no MU Kame. Primeira batalha a ser anunciada.";

export const Route = createFileRoute("/castle-siege")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/castle-siege" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/castle-siege" }],
  }),
  component: CastleSiegePage,
});

function CastleSiegePage() {
  const [state, setState] = useState<CastleSiegeState | null>(null);

  useEffect(() => {
    let active = true;
    api.getCastleSiege().then((data) => active && setState(data)).catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Guild dominante", value: state?.ownerGuild ?? "Indefinida", icon: Flag },
    { label: "Início do evento", value: state?.startDate ?? "A definir", icon: Castle },
    { label: "Fim do evento", value: state?.endDate ?? "A definir", icon: Castle },
    { label: "Guilds inscritas", value: String(state?.registeredGuilds ?? 0), icon: Users },
    { label: "Pontuação líder", value: state?.score !== null && state?.score !== undefined ? String(state.score) : "—", icon: Shield },
    { label: "Status", value: state?.status ?? "Cronograma em preparação", icon: DoorClosed },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Guerra de guilds"
        title="Castle Siege"
        description="Nenhuma guild domina este reino ainda. A primeira grande batalha do MU Kame será anunciada em breve."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <li key={card.label}>
              <StatCard label={card.label} value={card.value} icon={card.icon} accent="gold" />
            </li>
          ))}
        </ul>

        <SectionHeading
          eyebrow="Estrutura do castelo"
          title="O que será exibido durante o evento"
          description="Portões, estátuas, defesa, regeneração e vida atual serão acompanhados em tempo real após a integração."
          className="mb-6"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            title="Sign of Lord e guilds participantes"
            description="A lista de guilds inscritas e a pontuação aparecerão aqui quando as inscrições abrirem."
          />
          <EmptyState
            title="Tributos do castelo"
            description="Taxas da Chaos Machine, lojas e Hunt Zone serão divulgadas junto com o cronograma oficial."
          />
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-graylight">
          <Coins className="size-3.5" aria-hidden="true" />
          Informações financeiras detalhadas do castelo ficam restritas à administração do servidor.
        </p>
      </section>
    </SiteLayout>
  );
}
