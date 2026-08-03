import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { CommandTable, type Column } from "@/components/private/CommandTable";
import { CommandSearch } from "@/components/private/CommandSearch";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { OnlinePill } from "@/components/private/RoleBadge";
import { useApiResource } from "@/hooks/use-api-resource";
import { adminService } from "@/services/admin";
import { featureFlags } from "@/config/access";
import type { AdminCharacterRow } from "@/types/character";

export const Route = createFileRoute("/admin/personagens")({
  component: AdminCharactersPage,
});

function AdminCharactersPage() {
  const [search, setSearch] = useState("");
  const characters = useApiResource(
    ["admin", "characters", search],
    () => adminService.characters({ search }),
    { isEmpty: (page) => page.items.length === 0 },
  );

  const columns: Column<AdminCharacterRow>[] = [
    { key: "name", header: "Personagem", render: (row) => row.name },
    { key: "account", header: "Conta", mono: true, render: (row) => row.accountLogin },
    { key: "class", header: "Classe", render: (row) => row.className },
    { key: "level", header: "Level", align: "right", mono: true, render: (row) => row.level },
    { key: "reset", header: "Reset", align: "right", mono: true, render: (row) => row.resets },
    { key: "status", header: "Status", render: (row) => <OnlinePill online={row.online} /> },
    {
      key: "actions",
      header: "Operações",
      align: "right",
      render: (row) => (
        <div className="flex flex-col items-end gap-2">
          <PermissionGate permission="characters.write">
            <CriticalActionButton
              label="Editar"
              title={`Editar ${row.name}`}
              description="Altera atributos permitidos do personagem. Toda alteração é auditada com autor e justificativa."
              destructive={false}
              disabled={!featureFlags.enableAdminMutations}
              disabledHint="Mutações administrativas desativadas nesta fase."
              onConfirm={({ reason }) => adminService.updateCharacter({ characterId: row.id, fields: {}, reason })}
            />
          </PermissionGate>
          <PermissionGate permission="characters.move">
            <CriticalActionButton
              label="Mover"
              title={`Mover ${row.name} de conta`}
              description="Transfere o personagem para outra conta. Operação sensível e irreversível sem backup."
              disabled={!featureFlags.enableAdminMutations}
              disabledHint="Mutações administrativas desativadas nesta fase."
              onConfirm={({ reason }) =>
                adminService.moveCharacter({ characterId: row.id, targetAccount: "", reason })
              }
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-02"
        title="Personagens"
        description="Busca por personagem, edição de atributos permitidos e transferência entre contas."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Mesa de personagens" hint="busca por nome ou conta">
        <div className="flex flex-col gap-4">
          <CommandSearch value={search} onChange={setSearch} placeholder="Buscar personagem" className="max-w-md" />
          <ResourceGate
            phase={characters.phase}
            error={characters.error}
            onRetry={characters.refetch}
            emptyTitle="Nenhum personagem encontrado"
            emptyDescription="Ajuste a busca ou aguarde a conexão com a API oficial."
            loadingLabel="Consultando personagens…"
          >
            <CommandTable
              columns={columns}
              rows={characters.data?.items ?? []}
              rowKey={(row) => row.id}
              caption="Personagens do servidor"
            />
          </ResourceGate>
        </div>
      </ModuleBlock>
    </div>
  );
}
