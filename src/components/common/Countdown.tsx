import { useEffect, useMemo, useState } from "react";
import { serverConfig } from "@/config/server";
import { formatBrDateTime } from "@/lib/date-utils";

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function computeRemaining(target: number): Remaining {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: false,
  };
}

export type CountdownProps = {
  /** Data ISO de lançamento vinda da API (`data.server.launchDate`). */
  launchDate?: string | null;
};

/** Terminal CRT: contagem em IBM Plex Mono sobre vidro esverdeado de monitor antigo. */
export function Countdown({ launchDate }: CountdownProps) {
  const target = useMemo(() => {
    const parsed = launchDate ? new Date(launchDate).getTime() : Number.NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }, [launchDate]);

  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    if (target === null) {
      setRemaining(null);
      return;
    }
    setRemaining(computeRemaining(target));
    const id = window.setInterval(() => setRemaining(computeRemaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const launchLabel = launchDate ? formatBrDateTime(launchDate) : null;

  const units = [
    { label: "Dias", value: remaining?.days },
    { label: "Horas", value: remaining?.hours },
    { label: "Min", value: remaining?.minutes },
    { label: "Seg", value: remaining?.seconds },
  ];

  return (
    <div className="plate plate-cut launcher-sheet relative isolate overflow-hidden" aria-live="polite">
      <span aria-hidden="true" className="crt-lines crt-flicker pointer-events-none absolute inset-0" />

      <div className="relative flex items-center justify-between gap-3 border-b border-gold/25 bg-obsidian/70 px-4 py-2">
        <span className="label-text flex items-center gap-2 text-gold">
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
          kame_launcher.exe
        </span>
        <span className="data-text text-[0.65rem] text-arcane">{serverConfig.timezone}</span>
      </div>

      {remaining?.done ? (
        <div className="relative flex flex-col items-center gap-2 px-6 py-10 text-center">
          <p className="data-text text-[0.72rem] uppercase tracking-[0.24em] text-arcane">status: online</p>
          <h2 className="ceremonial text-2xl text-gold-soft">Servidor lançado</h2>
          <p className="text-sm text-parchment/85">Entre agora e construa sua história.</p>
        </div>
      ) : (
        <div className="relative px-4 py-5">
          <p className="data-text mb-4 text-[0.68rem] uppercase tracking-[0.18em] text-arcane">
            &gt; {launchLabel ? `abertura em ${launchLabel}` : "sincronizando data de abertura"}
            <span className="caret-blink ml-1 text-gold">_</span>
          </p>
          <ul className="grid grid-cols-4 gap-2">
            {units.map((unit) => (
              <li
                key={unit.label}
                className="flex flex-col items-center gap-1 border border-gold/20 bg-obsidian/60 py-3"
              >
                <span className="data-text text-2xl text-gold-soft sm:text-4xl">
                  {unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}
                </span>
                <span className="label-text text-[0.58rem] text-ash">{unit.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
