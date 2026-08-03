import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

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
    <div className="surface-card flex flex-col gap-1 p-5 transition-transform duration-300 hover:-translate-y-1">
      {Icon ? (
        <Icon
          className={cn("mb-2 size-5", accent === "jade" ? "text-jade" : "text-gold")}
          aria-hidden="true"
        />
      ) : null}
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-graylight">{label}</span>
      <span className={cn("font-display text-xl", accent === "jade" ? "text-ivory" : "text-gold-soft")}>{value}</span>
      {hint ? <span className="text-xs text-graylight">{hint}</span> : null}
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
    <div className="surface-card flex gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-jade/25">
      {Icon ? (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-jade/20 bg-jade/10">
          <Icon className="size-4 text-jade" aria-hidden="true" />
        </span>
      ) : null}
      <div className="flex flex-col gap-1">
        <h3 className="card-title text-ivory">{title}</h3>
        {description ? <p className="text-sm leading-relaxed text-mist">{description}</p> : null}
      </div>
    </div>
  );
}

export function TagBadge({ children, tone = "jade" }: { children: string; tone?: "jade" | "gold" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
        tone === "jade" && "border-jade/30 bg-jade/10 text-jade",
        tone === "gold" && "border-gold/30 bg-gold/10 text-gold-soft",
        tone === "muted" && "border-white/10 bg-white/5 text-mist",
      )}
    >
      {children}
    </span>
  );
}
