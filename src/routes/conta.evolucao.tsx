import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { SlotList } from "@/components/private/CommandTable";
import { useApiResource } from "@/hooks/use-api-resource";
import { playerService } from "@/services/player";

export const Route = createFileRoute("/conta/evolucao")({
  component: EvolutionPage,
});

function EvolutionPage() {
  const characters = useApiResource(["player", "characters"], () => playerService.characters(), {
    isEmpty: (rows) => rows.length === 0,
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-02"
        title="Evolução"
        description="Progresso consolidado dos seus personagens: resets, master resets e distribuição de pontos por slot."
      />
      <MutationsNotice scope="player" />

      <ResourceGate
        phase={characters.phase}
        error={characters.error}
        onRetry={characters.refetch}
        emptyTitle="Sem progresso para exibir"
        emptyDescription="Assim que houver personagens na conta, a evolução aparecerá slot por slot."
        loadingLabel="Calculando evolução…"
      >
        <div className="flex flex-col gap-4">
          {(characters.data ?? []).map((slot) => (
            <ModuleBlock key={slot.id} title={slot.name} hint={slot.className}>
              <SlotList
                items={[
                  { label: "Level", value: slot.level },
                  { label: "Master level", value: slot.masterLevel },
                  { label: "Resets", value: slot.resets },
                  { label: "Master resets", value: slot.masterResets },
                  { label: "Pontos livres", value: slot.statPoints },
                  { label: "Guild", value: slot.guild ?? "—" },
                ]}
              />
            </ModuleBlock>
          ))}
        </div>
      </ResourceGate>
    </div>
  );
}
