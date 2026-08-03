import { useEffect, useState } from "react";
import { serverConfig } from "@/config/server";
import { api, DEMO_MODE, type ServerStatus } from "@/services/api";

const statusLabel: Record<ServerStatus["status"], string> = {
  online: "Online",
  offline: "Offline",
  preparing: "Em preparação",
};

/** Faixa de leitura técnica: dados do servidor em mono, no espírito de um painel de LAN house. */
export function ServerStatusBar() {
  const [status, setStatus] = useState<ServerStatus | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getStatus()
      .then((data) => {
        if (active) setStatus(data);
      })
      .catch(() => {
        if (active) setStatus(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const items = [
    { label: "Servidor", value: status ? statusLabel[status.status] : "Em preparação" },
    { label: "Online", value: String(status?.playersOnline ?? 0) },
    { label: "Season", value: serverConfig.season },
    { label: "Estilo", value: serverConfig.mode },
    { label: "Master Lv.", value: String(serverConfig.masterLevel) },
    { label: "Plataforma", value: serverConfig.platform },
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
        {DEMO_MODE ? (
          <p className="mt-3 border-t border-gold/15 pt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            &gt; dados em tempo real após a integração com o servidor
          </p>
        ) : null}
      </div>
    </section>
  );
}
