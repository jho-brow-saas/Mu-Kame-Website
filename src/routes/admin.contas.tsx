import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { CommandTable, type Column } from "@/components/private/CommandTable";
import { CommandSearch } from "@/components/private/CommandSearch";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { OnlinePill, RoleBadge } from "@/components/private/RoleBadge";
import { useApiResource } from "@/hooks/use-api-resource";
import { adminService } from "@/services/admin";
import { featureFlags } from "@/config/access";
import type { AdminAccountRow } from "@/types/account";

export const Route = createFileRoute("/admin/contas")({
  component: AdminAccountsPage,
});

function AdminAccountsPage() {
  const [search, setSearch] = useState("");
  const accounts = useApiResource(
    ["admin", "accounts", search],
    () => adminService.accounts({ search }),
    { isEmpty: (page) => page.items.length === 0 },
  );

  const columns: Column<AdminAccountRow>[] = [
    { key: "login", header: "Conta", render: (row) => row.login },
    { key: "email", header: "E-mail", mono: true, render: (row) => row.maskedEmail },
    { key: "role", header: "Papel", render: (row) => <RoleBadge role={row.role} /> },
    { key: "vip", header: "VIP", render: (row) => `${row.vipTier}${row.vipExpiresAt ? ` · ${row.vipExpiresAt}` : ""}` },
    { key: "chars", header: "Chars", align: "right", mono: true, render: (row) => row.charactersCount },
    { key: "status", header: "Status", render: (row) => <OnlinePill online={row.online} /> },
    {
      key: "blocked",
      header: "Bloqueio",
      align: "right",
      render: (row) => (
        <PermissionGate permission="accounts.block" fallback={<span className="text-ash">—</span>}>
          <CriticalActionButton
            label={row.blocked ? "Desbloquear" : "Bloquear"}
            title={`${row.blocked ? "Desbloquear" : "Bloquear"} a conta ${row.login}`}
            description="O acesso ao jogo e ao site é imediatamente afetado. A operação exige justificativa e reautenticação."
            destructive={!row.blocked}
            disabled={!featureFlags.enableAdminMutations}
            disabledHint="Mutações administrativas desativadas nesta fase."
            onConfirm={({ reason }) =>
              adminService.setAccountBlocked({ accountId: row.id, blocked: !row.blocked, reason })
            }
          />
        </PermissionGate>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-01"
        title="Contas"
        description="Busca por conta, bloqueio e desbloqueio, e edição dos campos permitidos. Dados sigilosos permanecem mascarados pela API."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Mesa de contas" hint="busca por login ou e-mail mascarado">
        <div className="flex flex-col gap-4">
          <CommandSearch value={search} onChange={setSearch} placeholder="Buscar conta" className="max-w-md" />
          <ResourceGate
            phase={accounts.phase}
            error={accounts.error}
            onRetry={accounts.refetch}
            emptyTitle="Nenhuma conta encontrada"
            emptyDescription="Ajuste a busca ou aguarde a conexão com a API oficial."
            loadingLabel="Consultando contas…"
          >
            <CommandTable
              columns={columns}
              rows={accounts.data?.items ?? []}
              rowKey={(row) => row.id}
              caption="Contas cadastradas"
            />
          </ResourceGate>
        </div>
      </ModuleBlock>
    </div>
  );
}
