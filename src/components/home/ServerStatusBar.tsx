import { useServerStatus } from "@/hooks/use-server-status";
import { serverStateLabel } from "@/lib/mukame-format";

/** Faixa de leitura técnica: dados reais do servidor em mono, no espírito de um painel de LAN house. */
export function ServerStatusBar() {
  const { data, isPending, isError, refetch } = useServerStatus();
  const server = data?.server;

  const placeholder = isPending ? "···" : "—";

  const items = [
    { label: "Servidor", value: serverStateLabelOrPlaceholder(data?.state, isPending) },
    {
      label: "Online",
      value: data ? String(data.publicDataEnabled ? data.onlinePlayers : 0) : placeholder,
    },
    { label: "Season", value: server?.season ?? placeholder },
    { label: "Estilo", value: server?.mode ?? placeholder },
    { label: "Master Lv.", value: server ? String(server.masterLevel) : placeholder },
    { label: "Plataforma", value: server?.platform ?? placeholder },
  ];

  return (
    <section className="metal-sheet relative isolate overflow-hidden edge-rule-bottom" aria-label="Status do servidor">
      <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 divide-gold/15 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {items.map((item) => (
            <li key={item.label} className="flex flex-col gap-0.5 px-0 py-2 lg:px-4">
              <span className="label-text text-ash">{item.label}</span>
              <span className="data-text text-base text-gold-soft">{item.value}</span>
            </li>
          ))}
        </ul>
        {isError ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gold/15 pt-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ash">
              &gt; não foi possível ler o status do servidor agora
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="min-h-[32px] border border-gold/40 px-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-bone hover:border-gold hover:text-gold-soft"
            >
              Tentar novamente
            </button>
          </div>
        ) : data && !data.publicDataEnabled && data.message ? (
          <p className="mt-3 border-t border-gold/15 pt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            &gt; {data.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function serverStateLabelOrPlaceholder(
  state: Parameters<typeof serverStateLabel>[0],
  isPending: boolean,
): string {
  if (!state) return isPending ? "···" : "Em preparação";
  return serverStateLabel(state);
}
