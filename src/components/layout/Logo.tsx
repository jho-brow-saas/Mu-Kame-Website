import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="bronze-sheet relative flex size-11 items-center justify-center border border-gold/50 shadow-[inset_0_1px_0_rgb(255_255_255_/_18%),0_6px_14px_-10px_#000]"
        style={{
          clipPath:
            "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        }}
      >
        <span className="absolute inset-[3px] border border-obsidian/70" />
        <span className="font-display text-[0.9rem] leading-none text-gold-soft">K</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[0.58rem] tracking-[0.42em] text-bronze">MU ONLINE</span>
        <span
          className={cn(
            "font-display tracking-[0.14em] text-bone",
            compact ? "text-[1.05rem]" : "text-[1.2rem]",
          )}
        >
          KAME
        </span>
      </span>
    </span>
  );
}
