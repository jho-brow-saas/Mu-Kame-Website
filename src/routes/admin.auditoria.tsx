import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader } from "@/components/private/PrivateShell";
import { OperationHistory } from "@/components/private/OperationHistory";
import { useApiResource } from "@/hooks/use-api-resource";
import { adminService } from "@/services/admin";
import { FileClock } from "lucide-react";

export const Route = createFileRoute("/admin/auditoria")({
  component: AdminAuditPage,
});

function AdminAuditPage() {
  const audit = useApiResource(["admin", "audit"], () => adminService.audit(), {
    isEmpty: (page) => page.items.length === 0,
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-11"
        title="Auditoria"
        description="Registro imutável de operações administrativas: autor, alvo, justificativa, data e resultado."
      />

      <p className="flex items-start gap-2 border border-mana/50 bg-mana/15 px-4 py-3 font-mono text-[0.68rem] leading-relaxed text-arcane">
        <FileClock className="mt-px size-3.5 shrink-0" aria-hidden="true" />
        A auditoria é gravada pela API no servidor. O frontend apenas consulta — não cria, edita ou remove registros.
      </p>

      <ModuleBlock title="Trilha de auditoria" hint="somente leitura">
        <OperationHistory
          entries={audit.data?.items ?? []}
          phase={audit.phase}
          caption="Operações administrativas registradas"
        />
      </ModuleBlock>
    </div>
  );
}
