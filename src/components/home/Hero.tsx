import { serverConfig } from "@/config/server";
import { Countdown } from "@/components/common/Countdown";
import { ActionAnchor, ActionLink } from "@/components/ui-kit/Buttons";
import { Download, ShieldPlus, Compass } from "lucide-react";
import heroImage from "@/assets/hero-realm.jpg";

const specs = [
  { label: "Season", value: serverConfig.season },
  { label: "Progressão", value: serverConfig.mode },
  { label: "Master Level", value: String(serverConfig.masterLevel) },
  { label: "Plataforma", value: serverConfig.platform },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden edge-rule-bottom">
      <img
        src={heroImage}
        alt="Horizonte medieval noturno com um portal arcano distante e silhuetas de guerreiros"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover opacity-30 contrast-125 saturate-50"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-obsidian/70 via-obsidian/88 to-obsidian"
      />
      <span aria-hidden="true" className="topo-lines pointer-events-none absolute inset-0 opacity-60" />
      <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24 lg:px-8">
        <div className="flex flex-col gap-6">
          <span className="bronze-sheet btn-cut w-fit border border-gold/45 px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-gold-soft">
            {serverConfig.tagline}
          </span>

          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.4em] text-bronze">
              <span aria-hidden="true" className="h-px w-10 bg-bronze" />
              MU KAME
            </span>
            <h1 className="hero-title text-bone">
              Reviva a lenda.
              <br />
              <span className="gold-gradient-text">Construa seu legado.</span>
            </h1>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-y border-gold/20 py-3">
            {specs.map((spec) => (
              <li key={spec.label} className="flex items-baseline gap-2">
                <span className="label-text text-ash">{spec.label}</span>
                <span className="data-text text-sm text-gold-soft">{spec.value}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionLink to="/cadastro">
              <ShieldPlus className="size-4" aria-hidden="true" />
              Criar conta
            </ActionLink>
            <ActionAnchor href={serverConfig.pcDownloadUrl} variant="secondary">
              <Download className="size-4" aria-hidden="true" />
              Baixar cliente
            </ActionAnchor>
            <ActionLink to="/rankings" variant="ghost">
              <Compass className="size-4" aria-hidden="true" />
              Explorar o servidor
            </ActionLink>
          </div>
        </div>

        <Countdown />
      </div>
    </section>
  );
}
