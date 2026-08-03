import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { SlotList } from "@/components/private/CommandTable";
import { OperationHistory } from "@/components/private/OperationHistory";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { useApiResource } from "@/hooks/use-api-resource";
import { playerService } from "@/services/player";
import { featureFlags } from "@/config/access";
import { EyeOff } from "lucide-react";

export const Route = createFileRoute("/conta/seguranca")({
  component: SecurityPage,
});

function SecurityPage() {
  const account = useApiResource(["player", "account"], () => playerService.account());
  const history = useApiResource(["player", "history"], () => playerService.history(), {
    isEmpty: (rows) => rows.length === 0,
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-06"
        title="Segurança"
        description="Estado de proteção da conta. Senha, e-mail completo, IP, pergunta e resposta secreta nunca são exibidos nesta área."
      />
      <MutationsNotice scope="player" />

      <p className="flex items-start gap-2 border border-mana/50 bg-mana/15 px-4 py-3 font-mono text-[0.68rem] leading-relaxed text-arcane">
        <EyeOff className="mt-px size-3.5 shrink-0" aria-hidden="true" />
        Campos sigilosos são mascarados pela API antes de chegarem ao navegador. O frontend não recebe nem armazena
        credenciais.
      </p>

      <ModuleBlock title="Estado da conta" hint="leitura mascarada">
        <ResourceGate phase={account.phase} error={account.error} onRetry={account.refetch} loadingLabel="Verificando conta…">
          {account.data ? (
            <SlotList
              items={[
                { label: "E-mail", value: account.data.user.maskedEmail, hint: "sempre mascarado" },
                { label: "Papel", value: account.data.user.role },
                { label: "Último acesso", value: account.data.user.lastSeenAt ?? "—" },
                { label: "Criada em", value: account.data.createdAt ?? "—" },
                { label: "Bloqueio", value: account.data.blocked ? "ativo" : "nenhum" },
                { label: "Personagens", value: account.data.charactersCount },
              ]}
            />
          ) : null}
        </ResourceGate>
      </ModuleBlock>

      <ModuleBlock title="Operações sensíveis" hint="mutações desativadas">
        <div className="grid gap-4 md:grid-cols-2">
          <CriticalActionButton
            label="Encerrar todas as sessões"
            title="Encerrar sessões ativas"
            description="Desconecta a conta de todos os dispositivos e do jogo. Você precisará entrar novamente."
            destructive
            disabled={!featureFlags.enablePlayerMutations}
            disabledHint="Mutações do jogador desativadas nesta fase."
            onConfirm={({ reason }) =>
              playerService.runCharacterAction({ action: "abrir-chamado", characterId: "", reason })
            }
          />
          <CriticalActionButton
            label="Solicitar revisão de segurança"
            title="Solicitar revisão de segurança"
            description="Abre um chamado prioritário para a equipe auditar acessos suspeitos na sua conta."
            destructive={false}
            disabled={!featureFlags.enablePlayerMutations}
            disabledHint="Mutações do jogador desativadas nesta fase."
            onConfirm={({ reason }) =>
              playerService.openTicket({ subject: "Revisão de segurança", category: "conta", message: reason })
            }
          />
        </div>
      </ModuleBlock>

      <ModuleBlock title="Acessos e operações" hint="registro">
        <OperationHistory entries={history.data ?? []} phase={history.phase} caption="Eventos de segurança" />
      </ModuleBlock>
    </div>
  );
}
