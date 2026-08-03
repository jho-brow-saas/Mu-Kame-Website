import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { CommandTable, type Column } from "@/components/private/CommandTable";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { useApiResource } from "@/hooks/use-api-resource";
import { adminService, type AdminOnlineRow } from "@/services/admin";
import { featureFlags } from "@/config/access";

export const Route = createFileRoute("/admin/online")({
  component: AdminOnlinePage,
});

function AdminOnlinePage() {
  const online = useApiResource(["admin", "online"], () => adminService.online(), {
    isEmpty: (rows) => rows.length === 0,
    staleTime: 10_000,
  });

  const columns: Column<AdminOnlineRow>[] = [
    { key: "character", header: "Personagem", render: (row) => row.characterName },
    { key: "account", header: "Conta", mono: true, render: (row) => row.accountLogin },
    { key: "map", header: "Mapa", render: (row) => row.map ?? "—" },
    { key: "since", header: "Conectado em", mono: true, render: (row) => row.connectedAt ?? "—" },
    {
      key: "actions",
      header: "Operação",
      align: "right",
      render: (row) => (
        <PermissionGate permission="online.disconnect" fallback={<span className="text-ash">—</span>}>
          <CriticalActionButton
            label="Desconectar"
            title={`Desconectar ${row.characterName}`}
            description="Encerra imediatamente a sessão do usuário no jogo. Pode causar perda de progresso não salvo."
            disabled={!featureFlags.enableAdminMutations}
            disabledHint="Mutações administrativas desativadas nesta fase."
            onConfirm={({ reason }) => adminService.disconnectUser({ accountId: row.id, reason })}
          />
        </PermissionGate>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-05"
        title="Online"
        description="Usuários conectados em tempo real, com desconexão controlada e auditada."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Sessões ativas" hint="atualiza a cada leitura">
        <ResourceGate
          phase={online.phase}
          error={online.error}
          onRetry={online.refetch}
          emptyTitle="Ninguém online"
          emptyDescription="Nenhuma sessão ativa foi reportada pela API neste momento."
          loadingLabel="Lendo sessões ativas…"
        >
          <CommandTable
            columns={columns}
            rows={online.data ?? []}
            rowKey={(row) => row.id}
            caption="Usuários conectados"
          />
        </ResourceGate>
      </ModuleBlock>
    </div>
  );
}
