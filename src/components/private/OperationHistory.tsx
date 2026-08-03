import { CommandTable, type Column } from "@/components/private/CommandTable";
import { ResourceGate } from "@/components/private/ResourceGate";
import type { OperationEntry } from "@/types/api";
import type { LoadPhase } from "@/types/api";

const columns: Column<OperationEntry>[] = [
  { key: "at", header: "Data", mono: true, render: (row) => row.at },
  { key: "actor", header: "Autor", render: (row) => row.actor },
  { key: "action", header: "Operação", render: (row) => row.action },
  { key: "target", header: "Alvo", render: (row) => row.target },
  { key: "reason", header: "Justificativa", render: (row) => row.reason ?? "—" },
  { key: "result", header: "Resultado", align: "right", mono: true, render: (row) => row.result },
];

export function OperationHistory({
  entries,
  phase,
  caption = "Histórico de operações",
}: {
  entries: OperationEntry[];
  phase: LoadPhase;
  caption?: string;
}) {
  return (
    <ResourceGate
      phase={phase}
      emptyTitle="Nenhuma operação registrada"
      emptyDescription="As operações realizadas na sua conta aparecerão aqui com data, autor e resultado."
    >
      <CommandTable
        columns={columns}
        rows={entries}
        rowKey={(row) => row.id}
        caption={caption}
        emptyLabel="Nenhuma operação registrada."
      />
    </ResourceGate>
  );
}
