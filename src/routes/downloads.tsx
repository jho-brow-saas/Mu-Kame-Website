import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionAnchor } from "@/components/ui-kit/Buttons";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { serverConfig } from "@/config/server";
import { Download, Monitor, Smartphone } from "lucide-react";

const title = "Downloads — MU Kame";
const description = "Baixe o cliente completo do MU Kame para Windows e o patch de atualização. Versão Android em desenvolvimento.";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/downloads" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/downloads" }],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Downloads"
        title="Prepare-se para entrar no continente."
        description="Cliente completo para Windows, patch de atualização e uma versão Android em desenvolvimento."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ul className="grid gap-5 md:grid-cols-3">
          <li className="surface-card flex flex-col gap-4 p-6">
            <Monitor className="size-5 text-gold" aria-hidden="true" />
            <h2 className="card-title text-ivory">Cliente completo (Windows)</h2>
            <p className="text-sm text-mist">Instalação completa do MU Kame para PC, pronta para o lançamento.</p>
            <ActionAnchor href={serverConfig.pcDownloadUrl} className="mt-auto">
              <Download className="size-4" aria-hidden="true" />
              Baixar cliente PC
            </ActionAnchor>
          </li>
          <li className="surface-card flex flex-col gap-4 p-6">
            <Download className="size-5 text-gold" aria-hidden="true" />
            <h2 className="card-title text-ivory">Patch de atualização</h2>
            <p className="text-sm text-mist">Atualize um cliente já instalado com os arquivos mais recentes.</p>
            <ActionAnchor href={serverConfig.patchDownloadUrl} variant="secondary" className="mt-auto">
              <Download className="size-4" aria-hidden="true" />
              Baixar patch
            </ActionAnchor>
          </li>
          <li className="surface-card flex flex-col gap-4 p-6">
            <Smartphone className="size-5 text-mist" aria-hidden="true" />
            <h2 className="card-title text-ivory">Android</h2>
            <p className="text-sm text-mist">Versão Android em desenvolvimento. Nenhuma data foi divulgada.</p>
            <span className="mt-auto text-xs text-graylight">Indisponível no momento.</span>
          </li>
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Instalação" title="Como instalar" className="mb-6" />
        <ol className="flex flex-col gap-3 text-sm text-mist">
          {[
            "Baixe o cliente completo para Windows.",
            "Extraia os arquivos em uma pasta sem acentos, fora de Program Files.",
            "Aplique o patch de atualização quando houver uma nova versão.",
            "Execute o launcher como administrador na primeira abertura.",
            "Crie sua conta no site e entre no jogo a partir de 01/09/2026.",
          ].map((step, index) => (
            <li key={step} className="surface-card flex gap-3 px-5 py-4">
              <span className="font-display text-gold-soft">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
