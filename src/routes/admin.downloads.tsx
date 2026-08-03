import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { EmptyState } from "@/components/ui-kit/States";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { featureFlags } from "@/config/access";
import { disabledError, fail } from "@/services/api";

export const Route = createFileRoute("/admin/downloads")({
  component: AdminDownloadsPage,
});

const slots = ["Cliente completo", "Patch atual", "Launcher", "Espelho alternativo"];

function AdminDownloadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-08"
        title="Downloads"
        description="Gestão dos pacotes oficiais e espelhos publicados na central de downloads."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Slots de arquivo" hint="fonte: API oficial">
        <ul className="grid gap-px bg-gold/10 sm:grid-cols-2">
          {slots.map((slot) => (
            <li key={slot} className="flex flex-col gap-1 bg-obsidian/70 px-4 py-3">
              <span className="label-text text-ash">{slot}</span>
              <span className="data-text text-sm text-gold-soft">— sem link publicado</span>
            </li>
          ))}
        </ul>
      </ModuleBlock>

      <ModuleBlock title="Histórico de versões" hint="registro">
        <EmptyState
          title="Nenhuma versão registrada"
          description="O histórico de patches aparecerá aqui quando a API oficial estiver conectada."
        />
      </ModuleBlock>

      <PermissionGate permission="downloads.write">
        <ModuleBlock title="Atualizar pacote" hint="escrita desativada">
          <CriticalActionButton
            label="Publicar novo link"
            title="Publicar link de download"
            description="Substitui o espelho atual do pacote selecionado na central pública de downloads."
            destructive={false}
            disabled={!featureFlags.enableAdminMutations}
            disabledHint="Publicação desativada até a API segura entrar em produção."
            className="sm:max-w-xs"
            onConfirm={async () => fail(disabledError)}
          />
        </ModuleBlock>
      </PermissionGate>
    </div>
  );
}
