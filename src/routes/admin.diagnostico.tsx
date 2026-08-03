import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ModuleBlock, ModuleHeader } from "@/components/private/PrivateShell";
import { SlotList } from "@/components/private/CommandTable";
import { LoadingState } from "@/components/ui-kit/States";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { API_BASE_URL, DEMO_MODE, checkApiHealth, endpoints } from "@/services/api";
import { featureFlags } from "@/config/access";
import { serverConfig } from "@/config/server";

export const Route = createFileRoute("/admin/diagnostico")({
  component: AdminDiagnosticsPage,
});

function AdminDiagnosticsPage() {
  const health = useQuery({
    queryKey: ["admin", "health"],
    queryFn: () => checkApiHealth(),
    staleTime: 15_000,
    retry: false,
  });

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-10"
        title="Diagnóstico"
        description="Estado do frontend e da API. Nenhum segredo é exibido: apenas a URL pública configurada e a latência medida."
      />

      <ModuleBlock title="Frontend" hint="build atual">
        <SlotList
          items={[
            { label: "Season", value: serverConfig.season },
            { label: "Modo", value: serverConfig.mode },
            { label: "Master level", value: serverConfig.masterLevel },
            { label: "Plataforma", value: serverConfig.platform },
            { label: "Modo demonstrativo", value: DEMO_MODE ? "ativo" : "inativo" },
            {
              label: "Mutações",
              value: Object.values(featureFlags).some(Boolean) ? "parcialmente ativas" : "todas desativadas",
            },
          ]}
        />
      </ModuleBlock>

      <ModuleBlock title="API oficial" hint={API_BASE_URL === "" ? "não configurada" : "configurada"}>
        {health.isPending ? (
          <LoadingState label="Medindo a API…" />
        ) : (
          <div className="flex flex-col gap-4">
            <SlotList
              items={[
                { label: "Alcançável", value: health.data?.reachable ? "sim" : "não" },
                { label: "Base URL", value: health.data?.baseUrl ?? "—" },
                { label: "Latência", value: health.data?.latencyMs !== null && health.data ? `${health.data.latencyMs} ms` : "—" },
                { label: "Verificado em", value: health.data?.checkedAt ?? "—" },
              ]}
            />
            <ActionButton variant="secondary" onClick={() => void health.refetch()} className="self-start">
              Medir novamente
            </ActionButton>
          </div>
        )}
      </ModuleBlock>

      <ModuleBlock title="Endpoints esperados" hint="contrato v2">
        <ul className="grid gap-px bg-gold/10 sm:grid-cols-2">
          {Object.entries(endpoints).map(([key, path]) => (
            <li key={key} className="flex items-center justify-between gap-3 bg-obsidian/70 px-4 py-2.5">
              <span className="label-text text-ash">{key}</span>
              <span className="data-text text-[0.68rem] text-gold-soft">{path}</span>
            </li>
          ))}
        </ul>
      </ModuleBlock>
    </div>
  );
}
