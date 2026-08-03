import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="relative flex size-10 items-center justify-center rounded-full border border-jade/40 bg-linear-to-br from-jade/20 to-gold/10"
      >
        <span className="absolute inset-1.5 rounded-full border border-gold/30" />
        <span className="size-1.5 rounded-full bg-jade-glow shadow-[0_0_10px_var(--jade-glow)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.62rem] tracking-[0.4em] text-jade">MU</span>
        <span className={cn("font-display tracking-[0.16em] text-ivory", compact ? "text-base" : "text-lg")}>
          KAME
        </span>
      </span>
    </span>
  );
}
