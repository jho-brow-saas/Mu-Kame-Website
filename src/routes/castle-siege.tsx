import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { StatCard } from "@/components/ui-kit/Cards";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { useCastleSiege } from "@/hooks/use-castle-siege";
import { formatBrDateTime } from "@/lib/mukame-format";
import { Castle, Coins, DoorClosed, Flag, Shield } from "lucide-react";

const title = "Castle Siege — MU Kame";
const description = "Guild dominante, cronograma e status do castelo no MU Kame, direto da API oficial do servidor.";

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
  const { data, isPending, isError, refetch } = useCastleSiege();
  const siege = data?.configured ? (data.castleSiege ?? null) : null;
  const owner = siege?.ownerGuild?.trim() ? siege.ownerGuild.trim() : null;

  const cards = [
    { label: "Guild dominante", value: owner ?? "Indefinida", icon: Flag },
    { label: "Início do evento", value: formatBrDateTime(siege?.startDate ?? null) ?? "A definir", icon: Castle },
    { label: "Fim do evento", value: formatBrDateTime(siege?.endDate ?? null) ?? "A definir", icon: Castle },
    {
      label: "Castelo ocupado",
      value: siege ? (siege.castleOccupied ? "Sim" : "Não") : "—",
      icon: Shield,
    },
    {
      label: "Status",
      value: siege ? (siege.siegeEnded ? "Cerco encerrado" : "Cerco em andamento") : "Cronograma em preparação",
      icon: DoorClosed,
    },
    {
      label: "Taxa da Chaos Machine",
      value: typeof siege?.chaosTax === "number" ? `${siege.chaosTax}%` : "—",
      icon: Coins,
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Guerra de guilds"
        title="Castle Siege"
        description="Estado do castelo lido diretamente do servidor oficial. Nenhuma data é inventada."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isPending ? <LoadingState label="Consultando o castelo…" /> : null}
        {isError ? (
          <ErrorState
            description="Não foi possível consultar o Castle Siege agora."
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isPending && !isError && !data?.configured ? (
          <EmptyState
            title="Castle Siege ainda não configurado"
            description="Data, horário, guild dominante e tributos aparecerão aqui assim que o cronograma oficial for definido."
          />
        ) : null}

        {data?.configured ? (
          <>
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
              description="Portões, estátuas, defesa e vida atual serão acompanhados quando a API expor esses dados."
              className="mb-6"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <EmptyState
                title="Sign of Lord e guilds participantes"
                description="A lista de guilds inscritas e a pontuação aparecerão aqui quando a API publicar esses dados."
              />
              <EmptyState
                title="Tributos do castelo"
                description={
                  typeof siege?.storeTax === "number" || typeof siege?.huntZoneTax === "number"
                    ? `Lojas: ${siege?.storeTax ?? 0}% · Hunt Zone: ${siege?.huntZoneTax ?? 0}%`
                    : "Taxas de lojas e Hunt Zone serão divulgadas junto com o cronograma oficial."
                }
              />
            </div>
          </>
        ) : null}

        <p className="mt-6 flex items-center gap-2 text-xs text-graylight">
          <Coins className="size-3.5" aria-hidden="true" />
          Informações financeiras detalhadas do castelo ficam restritas à administração do servidor.
        </p>
      </section>
    </SiteLayout>
  );
}
