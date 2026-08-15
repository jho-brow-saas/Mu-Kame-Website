import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionAnchor } from "@/components/ui-kit/Buttons";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { useDownloads } from "@/hooks/use-downloads";
import { isSafeExternalUrl } from "@/lib/mukame-format";
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
  const { data, isPending, isError, refetch } = useDownloads();
  const items = data?.items ?? [];

  // Filtramos os itens conforme a regra de negócio: 
  // O Launcher oficial (client-pc) é o principal.
  // O patch-pc deve ser ocultado na interface pública.
  const clientPc = items.find(item => item.id === "client-pc");
  const androidItem = items.find(item => item.platform.toLowerCase().includes("android"));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Downloads"
        title="Prepare-se para entrar no continente."
        description="Baixe o Launcher oficial para Windows e comece sua jornada no MU Kame."
      />
      
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isPending ? <LoadingState label="Carregando arquivos oficiais…" /> : null}
        
        {isError ? (
          <ErrorState
            description="Não foi possível carregar os downloads agora."
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isPending && !isError && !clientPc && !androidItem ? (
          <EmptyState
            title="Nenhum arquivo publicado"
            description="Os arquivos oficiais aparecerão aqui assim que forem liberados."
          />
        ) : null}

        {!isPending && !isError && (clientPc || androidItem) && (
          <div className="grid gap-5 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {/* Card Principal: Launcher Oficial */}
            {clientPc && (
              <div className="surface-card flex flex-col gap-4 p-8 border-gold/20 border">
                <div className="flex items-center gap-3">
                  <Monitor className="size-6 text-gold" aria-hidden="true" />
                  <span className="text-xs font-bold text-gold uppercase tracking-widest">Windows</span>
                </div>
                <h2 className="text-2xl font-display text-ivory">Launcher oficial para PC</h2>
                <p className="text-sm text-mist leading-relaxed">
                  Instale o Launcher oficial. Ele baixa, verifica e mantém o MU Kame atualizado automaticamente.
                </p>
                {clientPc.available && isSafeExternalUrl(clientPc.url) ? (
                  <ActionAnchor
                    href={clientPc.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="mt-6 w-full py-4 text-lg"
                  >
                    <Download className="size-5" aria-hidden="true" />
                    BAIXAR LAUNCHER
                  </ActionAnchor>
                ) : (
                  <div className="mt-6 text-center p-3 bg-coal/50 border border-white/5 rounded text-graylight text-sm">
                    Indisponível no momento
                  </div>
                )}
              </div>
            )}

            {/* Card Android: Em breve */}
            <div className="surface-card flex flex-col gap-4 p-8 opacity-60">
              <div className="flex items-center gap-3">
                <Smartphone className="size-6 text-mist" aria-hidden="true" />
                <span className="text-xs font-bold text-mist uppercase tracking-widest">Mobile</span>
              </div>
              <h2 className="text-2xl font-display text-ivory">Cliente Android</h2>
              <p className="text-sm text-mist leading-relaxed">
                A versão mobile está em fase final de testes e será liberada em breve para todos os jogadores.
              </p>
              <div className="mt-6 text-center p-3 bg-coal/50 border border-white/5 rounded text-graylight text-sm italic font-display">
                Em breve
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Instalação" title="Como instalar" className="mb-6" />
        <ol className="flex flex-col gap-3 text-sm text-mist">
          {[
            "Baixe o Launcher oficial do MU Kame.",
            "Execute MU-KAME-Setup.exe.",
            "Conclua a instalação do Launcher.",
            "Abra o MU Kame Launcher.",
            "O Launcher baixará e verificará automaticamente todos os arquivos do jogo.",
            "Entre na sua conta e clique em JOGAR AGORA.",
          ].map((step, index) => (
            <li key={step} className="surface-card flex gap-4 px-6 py-5 border-white/5 border">
              <span className="font-display text-gold text-lg leading-none">{index + 1}.</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
