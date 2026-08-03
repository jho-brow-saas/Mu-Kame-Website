import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { CommandTable, type Column } from "@/components/private/CommandTable";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { OnlinePill } from "@/components/private/RoleBadge";
import { useApiResource } from "@/hooks/use-api-resource";
import { characterActions, playerService } from "@/services/player";
import { featureFlags } from "@/config/access";
import type { CharacterSlot } from "@/types/character";

export const Route = createFileRoute("/conta/personagens")({
  component: CharactersPage,
});

const columns: Column<CharacterSlot>[] = [
  { key: "name", header: "Personagem", render: (row) => row.name },
  { key: "class", header: "Classe", render: (row) => row.className },
  { key: "level", header: "Level", align: "right", mono: true, render: (row) => row.level },
  { key: "ml", header: "Master", align: "right", mono: true, render: (row) => row.masterLevel },
  { key: "reset", header: "Reset", align: "right", mono: true, render: (row) => row.resets },
  { key: "mreset", header: "M. Reset", align: "right", mono: true, render: (row) => row.masterResets },
  { key: "kills", header: "Kills", align: "right", mono: true, render: (row) => row.kills },
  { key: "deaths", header: "Mortes", align: "right", mono: true, render: (row) => row.deaths },
  { key: "zen", header: "Zen", align: "right", mono: true, render: (row) => row.zen.toLocaleString("pt-BR") },
  { key: "status", header: "Status", align: "right", render: (row) => <OnlinePill online={row.online} /> },
];

function CharactersPage() {
  const characters = useApiResource(["player", "characters"], () => playerService.characters(), {
    isEmpty: (rows) => rows.length === 0,
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-01"
        title="Personagens"
        description="Slots da conta com level, resets, master reset, classe, kills, mortes e Zen. As ações abaixo já estão modeladas e serão liberadas com a API segura."
      />
      <MutationsNotice scope="player" />

      <ModuleBlock title="Slots da conta" hint="somente leitura">
        <ResourceGate
          phase={characters.phase}
          error={characters.error}
          onRetry={characters.refetch}
          emptyTitle="Nenhum personagem encontrado"
          emptyDescription="Crie um personagem no cliente do jogo para que ele apareça nesta lista."
          loadingLabel="Lendo slots de personagem…"
        >
          <CommandTable
            columns={columns}
            rows={characters.data ?? []}
            rowKey={(row) => row.id}
            caption="Personagens vinculados à sua conta"
          />
        </ResourceGate>
      </ModuleBlock>

      <ModuleBlock title="Operações de personagem" hint="mutações desativadas">
        <ul className="grid gap-4 md:grid-cols-2">
          {characterActions.map((spec) => (
            <li key={spec.action} className="flex flex-col gap-3 border border-gold/20 bg-obsidian/60 p-4">
              <div className="flex flex-col gap-1">
                <h3 className="card-title uppercase text-bone">{spec.label}</h3>
                <p className="text-sm leading-relaxed text-parchment/80">{spec.description}</p>
              </div>
              <CriticalActionButton
                label={spec.label}
                title={spec.label}
                description={`${spec.description} Escolha o personagem no jogo antes de confirmar. Esta operação é ${spec.destructive ? "destrutiva e irreversível" : "reversível"}.`}
                destructive={spec.destructive}
                requiresReason={spec.requiresReason}
                requiresReauth={spec.destructive}
                disabled={!featureFlags.enablePlayerMutations}
                disabledHint="Mutações do jogador desativadas nesta fase."
                onConfirm={({ reason }) =>
                  playerService.runCharacterAction({ action: spec.action, characterId: "", reason })
                }
              />
            </li>
          ))}
        </ul>
      </ModuleBlock>
    </div>
  );
}
