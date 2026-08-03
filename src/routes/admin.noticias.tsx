import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { EmptyState } from "@/components/ui-kit/States";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { featureFlags } from "@/config/access";
import { disabledError, fail } from "@/services/api";

export const Route = createFileRoute("/admin/noticias")({
  component: AdminNewsPage,
});

function AdminNewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-07"
        title="Notícias"
        description="Publicação, edição e arquivamento de notícias, eventos e comunicados do reino."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Publicações" hint="fonte: API oficial">
        <EmptyState
          title="Nenhuma publicação carregada"
          description="A listagem de notícias será preenchida pela API oficial. Nenhum conteúdo antigo foi reaproveitado."
        />
      </ModuleBlock>

      <PermissionGate permission="news.write">
        <ModuleBlock title="Nova publicação" hint="editor liberado com a API">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[0.7rem] leading-relaxed text-ash">
              O editor de conteúdo (título, categoria, capa e corpo) será habilitado junto com o endpoint de escrita.
              A estrutura da operação — confirmação, justificativa, reautenticação e auditoria — já está definida.
            </p>
            <CriticalActionButton
              label="Publicar notícia"
              title="Publicar nova notícia"
              description="Torna o conteúdo visível na página pública de notícias imediatamente após a confirmação."
              destructive={false}
              disabled={!featureFlags.enableAdminMutations}
              disabledHint="Publicação desativada até a API segura entrar em produção."
              className="sm:max-w-xs"
              onConfirm={async () => fail(disabledError)}
            />
          </div>
        </ModuleBlock>
      </PermissionGate>
    </div>
  );
}
