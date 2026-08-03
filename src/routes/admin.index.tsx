import { createFileRoute } from "@tanstack/react-router";
import { ModuleBlock, ModuleHeader, MutationsNotice } from "@/components/private/PrivateShell";
import { ResourceGate } from "@/components/private/ResourceGate";
import { SlotList } from "@/components/private/CommandTable";
import { useApiResource } from "@/hooks/use-api-resource";
import { adminService } from "@/services/admin";
import { adminNav } from "@/config/private-nav";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const dashboard = useApiResource(["admin", "dashboard"], () => adminService.dashboard());

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        code="CMD-00"
        title="Painel geral"
        description="Leitura consolidada do reino: contas, personagens, usuários online e chamados aguardando resposta."
      />
      <MutationsNotice scope="admin" />

      <ModuleBlock title="Indicadores do reino" hint="leitura">
        <ResourceGate
          phase={dashboard.phase}
          error={dashboard.error}
          onRetry={dashboard.refetch}
          loadingLabel="Consultando indicadores…"
        >
          {dashboard.data ? (
            <SlotList
              items={[
                { label: "Contas cadastradas", value: dashboard.data.accounts.toLocaleString("pt-BR") },
                { label: "Personagens", value: dashboard.data.characters.toLocaleString("pt-BR") },
                { label: "Usuários online", value: dashboard.data.online.toLocaleString("pt-BR") },
                { label: "Chamados aguardando", value: dashboard.data.pendingTickets.toLocaleString("pt-BR") },
                { label: "Contas bloqueadas", value: dashboard.data.blockedAccounts.toLocaleString("pt-BR") },
                { label: "VIP ativos", value: dashboard.data.vipActive.toLocaleString("pt-BR") },
              ]}
            />
          ) : null}
        </ResourceGate>
      </ModuleBlock>

      <ModuleBlock title="Módulos de comando" hint="acesso rápido">
        <ul className="grid gap-px bg-gold/10 sm:grid-cols-2 lg:grid-cols-3">
          {adminNav.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to} className="bg-obsidian/70">
                <Link
                  to={item.to}
                  className="flex min-h-[64px] items-center gap-3 px-4 py-3 transition-colors hover:bg-bronze-dark/35"
                >
                  <Icon className="size-4 text-bronze" aria-hidden="true" />
                  <span className="flex-1 font-ui text-[0.82rem] font-600 uppercase tracking-[0.12em] text-parchment">
                    {item.label}
                  </span>
                  <span className="data-text text-[0.62rem] text-ash">{item.code}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </ModuleBlock>
    </div>
  );
}
