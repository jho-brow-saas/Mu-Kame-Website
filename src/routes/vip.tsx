import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { VipPlansGrid } from "@/components/vip/VipPlansGrid";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { whatsappLink } from "@/config/server";
import { ActionAnchor } from "@/components/ui-kit/Buttons";
import { MessageCircle } from "lucide-react";

const title = "VIP — MU Kame";
const description = "Planos VIP Bronze, Prata e Ouro do MU Kame com 30 dias de duração e bônus de experiência e drop.";

export const Route = createFileRoute("/vip")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/vip" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/vip" }],
  }),
  component: VipPage,
});

function VipPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Assinaturas"
        title="Planos VIP"
        description="Três níveis de assinatura com 30 dias de duração cada. Benefícios complementares serão divulgados antes do lançamento."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <VipPlansGrid />
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SectionHeading
          eyebrow="Contratação"
          title="Como assinar"
          description="O pagamento online será liberado junto com o lançamento. Até então, fale com a equipe pelo WhatsApp oficial."
          className="mb-6"
        />
        <ActionAnchor href={whatsappLink} target="_blank" rel="noreferrer">
          <MessageCircle className="size-4" aria-hidden="true" />
          Falar com a equipe
        </ActionAnchor>
      </section>
    </SiteLayout>
  );
}
