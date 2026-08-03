import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { CommandSearch } from "@/components/private/CommandSearch";
import { CriticalActionButton } from "@/components/private/CriticalActionButton";
import { PermissionGate } from "@/components/private/PermissionGate";
import { adminService } from "@/services/admin";
import { featureFlags } from "@/config/access";
import { Coins } from "lucide-react";

export const Route = createFileRoute("/admin/moedas")({
  component: AdminWalletPage,
});

const fields = [
  { key: "wcoinC", label: "WCoinC" },
  { key: "wcoinP", label: "WCoinP" },
  { key: "goblinPoints", label: "Goblin Points" },
] as const;

function AdminWalletPage() {
  const [account, setAccount] = useState("");
  const [values, setValues] = useState<Record<string, string>>({ wcoinC: "", wcoinP: "", goblinPoints: "" });

  const parsed = Object.fromEntries(
    fields
      .map((field) => [field.key, Number(values[field.key])] as const)
      .filter(([, value]) => Number.isFinite(value) && value !== 0),
  );
  const hasDelta = Object.keys(parsed).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-04"
        title="Moedas"
        description="Ajuste de WCoinC, WCoinP e Goblin Points. Valores positivos creditam; negativos debitam. Todo ajuste é auditado."
      />
      <MutationsNotice scope="admin" />

      <PermissionGate
        permission="wallet.write"
        fallback={
          <p className="border border-gold/25 bg-obsidian/60 px-4 py-3 font-mono text-[0.7rem] text-ash">
            Seu papel não permite ajustar moedas.
          </p>
        }
      >
        <ModuleBlock title="Ajuste de carteira" hint={featureFlags.enableWalletAdjustments ? "ativo" : "desativado"}>
          <div className="flex flex-col gap-4">
            <CommandSearch value={account} onChange={setAccount} placeholder="Conta alvo" className="max-w-md" />
            <div className="grid gap-4 sm:grid-cols-3">
              {fields.map((field) => (
                <label key={field.key} className="flex flex-col gap-2">
                  <span className="label-text flex items-center gap-2 text-ash">
                    <Coins className="size-3.5 text-bronze" aria-hidden="true" />
                    {field.label}
                  </span>
                  <input
                    type="number"
                    value={values[field.key] ?? ""}
                    onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
                    className="min-h-[44px] border border-input bg-obsidian/70 px-3 font-mono text-sm text-bone outline-none focus-visible:border-gold"
                    placeholder="0"
                  />
                </label>
              ))}
            </div>
            <CriticalActionButton
              label="Aplicar ajuste"
              title="Ajustar moedas da conta"
              description="Credita ou debita moedas na conta informada. Operação financeira sensível, auditada e irreversível sem novo ajuste."
              disabled={!featureFlags.enableWalletAdjustments || account.trim().length < 3 || !hasDelta}
              disabledHint="Informe conta e valores. Ajustes de carteira estão desativados nesta fase."
              className="sm:max-w-xs"
              onConfirm={({ reason }) => adminService.adjustWallet({ accountId: account.trim(), ...parsed, reason })}
            />
          </div>
        </ModuleBlock>
      </PermissionGate>
    </div>
  );
}
