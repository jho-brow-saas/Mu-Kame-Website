import { cn } from "@/lib/utils";
import { roleLabels } from "@/config/access";
import type { AppRole } from "@/types/account";
import { ShieldHalf } from "lucide-react";

const tone: Record<AppRole, string> = {
  player: "border-stone/60 bg-obsidian/70 text-parchment",
  support: "border-mana/70 bg-mana/25 text-arcane",
  moderator: "border-bronze/70 bg-bronze-dark/60 text-parchment",
  admin: "border-gold/55 bg-bronze-dark/70 text-gold-soft",
  owner: "border-crimson/60 bg-wine/40 text-bone",
};

export function RoleBadge({ role, className }: { role: AppRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em]",
        tone[role],
        className,
      )}
    >
      <ShieldHalf className="size-3" aria-hidden="true" />
      {roleLabels[role]}
    </span>
  );
}

export function OnlinePill({ online, label }: { online: boolean; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-gold/25 bg-obsidian/70 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rotate-45", online ? "bg-arcane" : "bg-stone")}
      />
      {label ?? (online ? "Online" : "Offline")}
    </span>
  );
}
