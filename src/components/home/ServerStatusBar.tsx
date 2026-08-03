import { useEffect, useState } from "react";
import { serverConfig } from "@/config/server";
import { api, DEMO_MODE, type ServerStatus } from "@/services/api";
import { Gauge, Monitor, Sparkles, Users, Layers, Award } from "lucide-react";

const statusLabel: Record<ServerStatus["status"], string> = {
  online: "Online",
  offline: "Offline",
  preparing: "Em preparação",
};

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
    { label: "Status do servidor", value: status ? statusLabel[status.status] : "Em preparação", icon: Gauge },
    { label: "Jogadores online", value: String(status?.playersOnline ?? 0), icon: Users },
    { label: "Season", value: serverConfig.season, icon: Sparkles },
    { label: "Estilo", value: serverConfig.mode, icon: Layers },
    { label: "Master Level", value: String(serverConfig.masterLevel), icon: Award },
    { label: "Plataforma", value: serverConfig.platform, icon: Monitor },
  ];

  return (
    <section className="border-y border-white/8 bg-[color:var(--realm)]/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <li key={item.label} className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-graylight">
                <item.icon className="size-3.5 text-jade" aria-hidden="true" />
                {item.label}
              </span>
              <span className="font-display text-lg text-ivory">{item.value}</span>
            </li>
          ))}
        </ul>
        {DEMO_MODE ? (
          <p className="mt-6 text-xs text-graylight">
            Dados em tempo real após a integração com o servidor.
          </p>
        ) : null}
      </div>
    </section>
  );
}
