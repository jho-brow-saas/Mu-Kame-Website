import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/** Slot de dado técnico: número em IBM Plex Mono sobre placa de ferro. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "jade",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  accent?: "jade" | "gold";
}) {
  return (
    <div className="plate plate-cut-slot group flex flex-col gap-1 p-4 transition-colors duration-200 hover:border-gold/55">
      <span className="label-text flex items-center gap-2 text-ash">
        {Icon ? (
          <Icon
            className={cn("size-3.5", accent === "gold" ? "text-gold" : "text-bronze")}
            aria-hidden="true"
          />
        ) : null}
        {label}
      </span>
      <span className="data-text text-xl text-gold-soft">{value}</span>
      {hint ? <span className="font-mono text-[0.68rem] text-ash">{hint}</span> : null}
      <span
        aria-hidden="true"
        className="mt-2 h-px w-full bg-linear-to-r from-bronze/70 to-transparent transition-colors group-hover:from-gold"
      />
    </div>
  );
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="plate plate-cut-soft flex h-full gap-4 p-5 transition-colors duration-200 hover:border-gold/50">
      {Icon ? (
        <span
          aria-hidden="true"
          className="bronze-sheet flex size-10 shrink-0 items-center justify-center border border-gold/40"
        >
          <Icon className="size-4 text-gold-soft" aria-hidden="true" />
        </span>
      ) : null}
      <div className="flex flex-col gap-1">
        <h3 className="card-title uppercase text-bone">{title}</h3>
        {description ? <p className="text-sm leading-relaxed text-parchment/80">{description}</p> : null}
      </div>
    </div>
  );
}

export function TagBadge({ children, tone = "jade" }: { children: string; tone?: "jade" | "gold" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em]",
        tone === "jade" && "border-mana/70 bg-mana/25 text-arcane",
        tone === "gold" && "border-gold/45 bg-bronze-dark/60 text-gold-soft",
        tone === "muted" && "border-stone/50 bg-obsidian/60 text-ash",
      )}
    >
      {children}
    </span>
  );
}

/** Cabeçalho de placa metálica com rebites, usado no topo de blocos de dados. */
export function PlateHeader({ children, right }: { children: string; right?: string }) {
  return (
    <div className="metal-sheet flex items-center justify-between gap-4 border-b border-gold/25 px-4 py-2.5">
      <span className="label-text flex items-center gap-2 text-gold-soft">
        <span aria-hidden="true" className="size-1.5 rotate-45 bg-bronze" />
        {children}
      </span>
      {right ? <span className="data-text text-[0.7rem] text-ash">{right}</span> : null}
    </div>
  );
}
