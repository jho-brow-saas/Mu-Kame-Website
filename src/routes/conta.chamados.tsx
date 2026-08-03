import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { CommandTable, type Column } from "@/components/private/CommandTable";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { useApiResource } from "@/hooks/use-api-resource";
import { playerService } from "@/services/player";
import { featureFlags } from "@/config/access";
import type { SupportTicket } from "@/types/api";

export const Route = createFileRoute("/conta/chamados")({
  component: TicketsPage,
});

const columns: Column<SupportTicket>[] = [
  { key: "id", header: "Protocolo", mono: true, render: (row) => row.id },
  { key: "subject", header: "Assunto", render: (row) => row.subject },
  { key: "category", header: "Categoria", render: (row) => row.category },
  { key: "status", header: "Status", render: (row) => row.status },
  { key: "openedAt", header: "Aberto em", mono: true, render: (row) => row.openedAt },
  { key: "messages", header: "Mensagens", align: "right", mono: true, render: (row) => row.messages },
];

const categories: SupportTicket["category"][] = ["conta", "personagem", "pagamento", "bug", "outro"];

function TicketsPage() {
  const tickets = useApiResource(["player", "tickets"], () => playerService.tickets(), {
    isEmpty: (rows) => rows.length === 0,
  });
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("conta");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const invalid = subject.trim().length < 4 || message.trim().length < 15;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (invalid || sending) return;
    setSending(true);
    const result = await playerService.openTicket({ subject: subject.trim(), category, message: message.trim() });
    setFeedback(result.ok ? "Chamado registrado." : result.error.message);
    setSending(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-05"
        title="Chamados"
        description="Abertura e acompanhamento de atendimentos com a equipe do MU Kame."
      />
      <MutationsNotice scope="player" />

      <ModuleBlock title="Seus chamados" hint="protocolos">
        <ResourceGate
          phase={tickets.phase}
          error={tickets.error}
          onRetry={tickets.refetch}
          emptyTitle="Nenhum chamado aberto"
          emptyDescription="Quando você abrir um atendimento, o protocolo aparecerá aqui."
          loadingLabel="Consultando chamados…"
        >
          <CommandTable columns={columns} rows={tickets.data ?? []} rowKey={(row) => row.id} caption="Atendimentos" />
        </ResourceGate>
      </ModuleBlock>

      <ModuleBlock title="Abrir chamado" hint={featureFlags.enablePlayerMutations ? "ativo" : "envio desativado"}>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <label className="flex flex-col gap-2">
            <span className="label-text text-ash">Assunto</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={120}
              className="border border-input bg-obsidian/70 px-3 py-2 font-sans text-sm text-bone outline-none focus-visible:border-gold"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="label-text text-ash">Categoria</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as SupportTicket["category"])}
              className="border border-input bg-obsidian/70 px-3 py-2 font-ui text-sm uppercase tracking-[0.1em] text-bone outline-none focus-visible:border-gold"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="label-text text-ash">Descrição</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              maxLength={1000}
              className="border border-input bg-obsidian/70 px-3 py-2 font-sans text-sm text-bone outline-none focus-visible:border-gold"
            />
          </label>
          {feedback ? (
            <p className="border border-gold/35 bg-bronze-dark/40 px-3 py-2 font-mono text-[0.7rem] text-parchment" role="status">
              {feedback}
            </p>
          ) : null}
          <ActionButton
            type="submit"
            disabled={invalid || sending || !featureFlags.enablePlayerMutations}
            className="self-start"
          >
            {sending ? "Enviando…" : "Registrar chamado"}
          </ActionButton>
        </form>
      </ModuleBlock>
    </div>
  );
}
