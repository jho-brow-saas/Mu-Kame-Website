import { useEffect, useState } from "react";
import { serverConfig } from "@/config/server";

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

const target = new Date(serverConfig.launchDate).getTime();

export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(computeRemaining(target));
    const id = window.setInterval(() => setRemaining(computeRemaining(target)), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (remaining?.done) {
    return (
      <div className="surface-card flex flex-col items-center gap-2 px-6 py-8 text-center">
        <h2 className="font-display text-2xl text-jade">O servidor está online</h2>
        <p className="text-sm text-mist">Entre agora e construa sua história.</p>
      </div>
    );
  }

  const units = [
    { label: "Dias", value: remaining?.days },
    { label: "Horas", value: remaining?.hours },
    { label: "Minutos", value: remaining?.minutes },
    { label: "Segundos", value: remaining?.seconds },
  ];

  return (
    <div className="surface-card px-5 py-6" aria-live="polite">
      <p className="mb-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-graylight">
        Lançamento oficial • {serverConfig.launchLabel}
      </p>
      <ul className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((unit) => (
          <li key={unit.label} className="flex flex-col items-center gap-1 rounded-xl border border-white/8 bg-white/3 py-3">
            <span className="font-display text-2xl text-ivory tabular-nums sm:text-4xl">
              {unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-graylight">{unit.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
