import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { SlotList } from "@/components/private/CommandTable";
import { OperationHistory } from "@/components/private/OperationHistory";
import { OnlinePill } from "@/components/private/RoleBadge";
import { useApiResource } from "@/hooks/use-api-resource";
import { playerService } from "@/services/player";

export const Route = createFileRoute("/conta/")({
  component: AccountSummaryPage,
});

function AccountSummaryPage() {
  const account = useApiResource(["player", "account"], () => playerService.account());
  const history = useApiResource(["player", "history"], () => playerService.history(), {
    isEmpty: (rows) => rows.length === 0,
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-00"
        title="Resumo da conta"
        description="Situação geral do seu registro no MU Kame. Dados sensíveis como senha, e-mail completo, IP e pergunta secreta nunca são exibidos aqui."
      />
      <MutationsNotice scope="player" />

      <ModuleBlock title="Registro do aventureiro" hint="leitura">
        <ResourceGate
          phase={account.phase}
          error={account.error}
          onRetry={account.refetch}
          loadingLabel="Consultando registro da conta…"
        >
          {account.data ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <OnlinePill online={account.data.user.online} />
                <span className="data-text text-sm text-bone">{account.data.user.displayName}</span>
                <span className="font-mono text-[0.68rem] text-ash">{account.data.user.maskedEmail}</span>
              </div>
              <SlotList
                items={[
                  { label: "Nível VIP", value: account.data.vip.label },
                  {
                    label: "Vencimento do VIP",
                    value: account.data.vip.expiresAt ?? "—",
                    ...(account.data.vip.daysLeft !== null
                      ? { hint: `${account.data.vip.daysLeft} dia(s) restantes` }
                      : {}),
                  },
                  { label: "WCoinC", value: account.data.wallet.wcoinC.toLocaleString("pt-BR") },
                  { label: "WCoinP", value: account.data.wallet.wcoinP.toLocaleString("pt-BR") },
                  { label: "Goblin Points", value: account.data.wallet.goblinPoints.toLocaleString("pt-BR") },
                  { label: "Personagens", value: account.data.charactersCount },
                ]}
              />
              {account.data.blocked ? (
                <p className="border border-crimson/60 bg-wine/30 px-4 py-3 font-mono text-[0.7rem] text-bone">
                  Conta bloqueada. Motivo informado pela equipe: {account.data.blockedReason ?? "não informado"}.
                </p>
              ) : null}
            </div>
          ) : null}
        </ResourceGate>
      </ModuleBlock>

      <ModuleBlock title="Histórico de operações" hint="auditoria do jogador">
        <OperationHistory entries={history.data ?? []} phase={history.phase} caption="Últimas operações da conta" />
      </ModuleBlock>
    </div>
  );
}
