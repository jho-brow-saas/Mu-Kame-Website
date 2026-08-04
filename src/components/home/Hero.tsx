import { Countdown } from "@/components/common/Countdown";
import { ActionAnchor, ActionLink } from "@/components/ui-kit/Buttons";
import { useSettings } from "@/hooks/use-settings";
import { useServerStatus } from "@/hooks/use-server-status";
import { serverConfig } from "@/config/server";
import { Download, ShieldPlus, Compass } from "lucide-react";
import heroImage from "@/assets/hero-realm.jpg";

export function Hero() {
  const { data: statusData, isPending: isStatusPending } = useServerStatus();
  const { data: settingsData, isPending: isSettingsPending } = useSettings();
  
  const server = statusData?.server;
  const settings = settingsData;
  const placeholder = (isStatusPending || isSettingsPending) ? "···" : "—";

  const platformsData =
    settings?.platforms &&
    typeof settings.platforms === "object" &&
    !Array.isArray(settings.platforms)
      ? settings.platforms
      : {};

  const availablePlatforms = Object.entries(platformsData)
    .filter(([, enabled]) => enabled === true)
    .map(([platform]) => {
      if (platform === "pc") return "PC";
      if (platform === "android") return "Android";
      return platform;
    });

  const platformsLabel =
    availablePlatforms.length > 0
      ? availablePlatforms.join(" e ")
      : (server?.platform ?? placeholder);

  const specs = [
    { label: "Season", value: settings?.season ?? server?.season ?? placeholder },
    { label: "Progressão", value: settings?.mode ?? server?.mode ?? placeholder },
    { label: "Master Level", value: settings ? String(settings.masterLevel) : (server ? String(server.masterLevel) : placeholder) },
    { label: "Plataforma", value: platformsLabel },
  ];

  return (
    <section className="relative isolate min-h-[38rem] overflow-hidden edge-rule-bottom">
      <img
        src={heroImage}
        alt="Fortaleza medieval gótica ao luar com muralhas iluminadas por tochas e cavaleiros em silhueta diante de um portal arcano"
        width={1920}
        height={1088}
        loading="eager"
        decoding="sync"

        sizes="100vw"
        className="absolute inset-0 size-full scale-105 object-cover object-[72%_center] opacity-90 brightness-[1.9] contrast-105 saturate-75 sm:object-[66%_center] lg:scale-100 lg:object-[62%_center] lg:opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-obsidian/35 via-transparent to-obsidian"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-obsidian via-obsidian/60 to-transparent lg:from-obsidian/90 lg:via-obsidian/10 lg:to-transparent"
      />

      <span aria-hidden="true" className="topo-lines pointer-events-none absolute inset-0 opacity-40" />
      <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24 lg:px-8">
        <div className="flex flex-col gap-6">
          <span className="bronze-sheet btn-cut w-fit border border-gold/45 px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-gold-soft">
            {serverConfig.tagline}
          </span>

          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.4em] text-bronze">
              <span aria-hidden="true" className="h-px w-10 bg-bronze" />
              {settings?.serverName ?? server?.name ?? "MU KAME"}
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
            <ActionLink to="/criar-conta">
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

        <Countdown launchDate={settings?.launchDate ?? server?.launchDate ?? null} />
      </div>
    </section>
  );
}
