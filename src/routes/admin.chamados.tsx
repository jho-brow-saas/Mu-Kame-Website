import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { CommandTable, type Column } from "@/components/private/CommandTable";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { useApiResource } from "@/hooks/use-api-resource";
import { adminService } from "@/services/admin";
import { featureFlags } from "@/config/access";
import type { SupportTicket } from "@/types/api";

export const Route = createFileRoute("/admin/chamados")({
  component: AdminTicketsPage,
});

function AdminTicketsPage() {
  const tickets = useApiResource(["admin", "tickets"], () => adminService.tickets(), {
    isEmpty: (rows) => rows.length === 0,
  });

  const columns: Column<SupportTicket>[] = [
    { key: "id", header: "Protocolo", mono: true, render: (row) => row.id },
    { key: "subject", header: "Assunto", render: (row) => row.subject },
    { key: "category", header: "Categoria", render: (row) => row.category },
    { key: "status", header: "Status", render: (row) => row.status },
    { key: "openedAt", header: "Aberto em", mono: true, render: (row) => row.openedAt },
    {
      key: "actions",
      header: "Resposta",
      align: "right",
      render: (row) => (
        <PermissionGate permission="tickets.reply" fallback={<span className="text-ash">—</span>}>
          <CriticalActionButton
            label="Responder"
            title={`Responder o chamado ${row.id}`}
            description="A resposta é enviada ao jogador e fica registrada no histórico do atendimento."
            destructive={false}
            requiresReauth={false}
            disabled={!featureFlags.enableAdminMutations}
            disabledHint="Mutações administrativas desativadas nesta fase."
            confirmLabel="Enviar resposta"
            onConfirm={({ reason }) => adminService.replyTicket({ ticketId: row.id, message: reason })}
          />
        </PermissionGate>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-06"
        title="Chamados"
        description="Fila de atendimento com protocolo, categoria e status. Respostas ficam registradas no histórico do jogador."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Fila de atendimento" hint="ordem de abertura">
        <ResourceGate
          phase={tickets.phase}
          error={tickets.error}
          onRetry={tickets.refetch}
          emptyTitle="Nenhum chamado aguardando"
          emptyDescription="A fila está vazia ou a API ainda não foi conectada."
          loadingLabel="Consultando chamados…"
        >
          <CommandTable columns={columns} rows={tickets.data ?? []} rowKey={(row) => row.id} caption="Chamados" />
        </ResourceGate>
      </ModuleBlock>
    </div>
  );
}
