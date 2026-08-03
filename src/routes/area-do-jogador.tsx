import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { EmptyState } from "@/components/ui-kit/States";
import { FeatureCard } from "@/components/ui-kit/Cards";
import { ActionLink } from "@/components/ui-kit/Buttons";
import { Coins, Download, LifeBuoy, ShieldCheck, Sword, Timer } from "lucide-react";

const title = "Área do jogador — MU Kame";
const description = "Consulte personagens, validade do VIP, status da conta e acessos recentes no MU Kame.";

export const Route = createFileRoute("/area-do-jogador")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/area-do-jogador" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/area-do-jogador" }],
  }),
  component: PlayerAreaPage,
});

const panels = [
  { title: "Personagens da conta", description: "Classe, nível, resets e Master Level de cada personagem.", icon: Sword },
  { title: "Validade do VIP", description: "Plano ativo, data de expiração e histórico de assinaturas.", icon: ShieldCheck },
  { title: "Moedas", description: "Saldo disponível para uso nos serviços oficiais do servidor.", icon: Coins },
  { title: "Últimos acessos", description: "Registro de entradas recentes para acompanhar a segurança da conta.", icon: Timer },
  { title: "Downloads", description: "Cliente completo e patches sempre atualizados.", icon: Download },
  { title: "Suporte", description: "Atendimento oficial pelo WhatsApp da equipe MU Kame.", icon: LifeBuoy },
];

function PlayerAreaPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Minha conta"
        title="Área do jogador"
        description="Este painel será liberado com a API oficial. Nenhum dado sensível da conta é exibido nesta página."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          title="Sessão não disponível"
          description="A autenticação real será habilitada com a API oficial do servidor."
          action={<ActionLink to="/login" variant="secondary">Ir para o login</ActionLink>}
          className="mb-8"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map((panel) => (
            <li key={panel.title}>
              <FeatureCard {...panel} />
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
