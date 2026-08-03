import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { SlotList } from "@/components/private/CommandTable";
import { ActionLink } from "@/components/ui-kit/Buttons";
import { useApiResource } from "@/hooks/use-api-resource";
import { playerService } from "@/services/player";

export const Route = createFileRoute("/conta/vip-moedas")({
  component: VipWalletPage,
});

function VipWalletPage() {
  const vip = useApiResource(["player", "vip"], () => playerService.vip());
  const wallet = useApiResource(["player", "wallet"], () => playerService.wallet());

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="KAM-03"
        title="VIP e moedas"
        description="Plano ativo, vencimento e saldo de WCoinC, WCoinP e Goblin Points. Compras e ajustes só ocorrem pelos canais oficiais."
      />
      <MutationsNotice scope="player" />

      <ModuleBlock title="Assinatura VIP" hint="leitura">
        <ResourceGate phase={vip.phase} error={vip.error} onRetry={vip.refetch} loadingLabel="Consultando VIP…">
          {vip.data ? (
            <div className="flex flex-col gap-4">
              <SlotList
                items={[
                  { label: "Plano", value: vip.data.label },
                  { label: "Vencimento", value: vip.data.expiresAt ?? "—" },
                  { label: "Dias restantes", value: vip.data.daysLeft ?? "—" },
                ]}
              />
              <ActionLink to="/vip" variant="secondary" className="self-start">
                Ver planos VIP
              </ActionLink>
            </div>
          ) : null}
        </ResourceGate>
      </ModuleBlock>

      <ModuleBlock title="Carteira" hint="WCoinC · WCoinP · Goblin">
        <ResourceGate phase={wallet.phase} error={wallet.error} onRetry={wallet.refetch} loadingLabel="Consultando saldo…">
          {wallet.data ? (
            <SlotList
              items={[
                { label: "WCoinC", value: wallet.data.wcoinC.toLocaleString("pt-BR") },
                { label: "WCoinP", value: wallet.data.wcoinP.toLocaleString("pt-BR") },
                { label: "Goblin Points", value: wallet.data.goblinPoints.toLocaleString("pt-BR") },
                { label: "Atualizado em", value: wallet.data.updatedAt ?? "—" },
              ]}
            />
          ) : null}
        </ResourceGate>
      </ModuleBlock>
    </div>
  );
}
