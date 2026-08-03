import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { CommandSearch } from "@/components/private/CommandSearch";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { adminService } from "@/services/admin";
import { featureFlags } from "@/config/access";
import type { VipStatus } from "@/types/account";

export const Route = createFileRoute("/admin/vip")({
  component: AdminVipPage,
});

const tiers: VipStatus["tier"][] = ["free", "bronze", "prata", "ouro"];

function AdminVipPage() {
  const [account, setAccount] = useState("");
  const [tier, setTier] = useState<VipStatus["tier"]>("bronze");
  const [expiresAt, setExpiresAt] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-03"
        title="VIP"
        description="Concessão, alteração de nível e ajuste de expiração de assinaturas VIP."
      />
      <MutationsNotice scope="admin" />

      <PermissionGate
        permission="vip.write"
        fallback={
          <p className="border border-gold/25 bg-obsidian/60 px-4 py-3 font-mono text-[0.7rem] text-ash">
            Seu papel não permite alterar VIP.
          </p>
        }
      >
        <ModuleBlock title="Alterar assinatura" hint="justificativa e reautenticação obrigatórias">
          <div className="flex flex-col gap-4">
            <CommandSearch value={account} onChange={setAccount} placeholder="Conta alvo" className="max-w-md" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="label-text text-ash">Nível</span>
                <select
                  value={tier}
                  onChange={(event) => setTier(event.target.value as VipStatus["tier"])}
                  className="min-h-[44px] border border-input bg-obsidian/70 px-3 font-ui text-sm uppercase tracking-[0.1em] text-bone outline-none focus-visible:border-gold"
                >
                  {tiers.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="label-text text-ash">Expira em</span>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                  className="min-h-[44px] border border-input bg-obsidian/70 px-3 font-mono text-sm text-bone outline-none focus-visible:border-gold"
                />
              </label>
            </div>
            <CriticalActionButton
              label="Aplicar VIP"
              title="Alterar assinatura VIP"
              description="Define nível e expiração da assinatura na conta informada. A operação é auditada."
              destructive={false}
              disabled={!featureFlags.enableAdminMutations || account.trim().length < 3}
              disabledHint="Informe a conta alvo. Mutações administrativas estão desativadas nesta fase."
              className="sm:max-w-xs"
              onConfirm={({ reason }) =>
                adminService.setVip({
                  accountId: account.trim(),
                  tier,
                  expiresAt: expiresAt === "" ? null : expiresAt,
                  reason,
                })
              }
            />
          </div>
        </ModuleBlock>
      </PermissionGate>
    </div>
  );
}
