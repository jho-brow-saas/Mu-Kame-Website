import { serverConfig } from "@/config/server";
import { Countdown } from "@/components/common/Countdown";
import { ActionAnchor, ActionLink } from "@/components/ui-kit/Buttons";
import { Download, ShieldPlus, Compass } from "lucide-react";
import heroImage from "@/assets/hero-realm.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroImage}
        alt="Horizonte medieval noturno com um portal arcano distante e silhuetas de guerreiros"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover opacity-35"
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-[color:var(--void)]/70 via-[color:var(--void)]/85 to-[color:var(--void)]"
        aria-hidden="true"
      />
      <div className="rune-grid absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28 lg:px-8">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold-soft">
            {serverConfig.tagline}
          </span>

          <div className="flex flex-col gap-2">
            <span className="font-display text-sm tracking-[0.4em] text-jade">MU KAME</span>
            <h1 className="hero-title text-ivory">
              Reviva a lenda.
              <br />
              <span className="gold-gradient-text">Construa seu legado.</span>
            </h1>
          </div>

          <p className="body-text max-w-xl text-mist">
            Season {serverConfig.season} • Servidor {serverConfig.mode} • {serverConfig.platform}
          </p>

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
