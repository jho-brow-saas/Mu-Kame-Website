import { cn } from "@/lib/utils";
import { AlertTriangle, Hourglass, ScrollText } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "plate plate-cut inner-rule relative flex flex-col items-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      <span aria-hidden="true" className="rune-grid absolute inset-0 opacity-50" />
      <span
        aria-hidden="true"
        className="bronze-sheet relative flex size-12 items-center justify-center border border-gold/40"
        style={{ clipPath: "polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)" }}
      >
        <ScrollText className="size-5 text-gold-soft" aria-hidden="true" />
      </span>
      <h3 className="card-title relative uppercase text-bone">{title}</h3>
      {description ? (
        <p className="relative max-w-md text-sm leading-relaxed text-parchment/80">{description}</p>
      ) : null}
      {action ? <div className="relative">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Carregando informações…" }: { label?: string }) {
  return (
    <div
      className="plate plate-cut-soft flex items-center justify-center gap-3 px-6 py-12 font-mono text-sm text-parchment"
      role="status"
    >
      <Hourglass className="size-4 animate-spin text-gold" aria-hidden="true" />
      {label}
      <span className="caret-blink text-gold" aria-hidden="true">
        _
      </span>
    </div>
  );
}

export function ErrorState({
  title = "Não foi possível carregar",
  description = "Tente novamente em alguns instantes.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="plate plate-cut-soft flex flex-col items-center gap-3 border-crimson/50 bg-wine/20 px-6 py-12 text-center">
      <AlertTriangle className="size-6 text-crimson" aria-hidden="true" />
      <h3 className="card-title uppercase text-bone">{title}</h3>
      <p className="max-w-md text-sm text-parchment/85">{description}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="btn-cut metal-sheet min-h-[44px] border border-gold/40 px-5 font-ui text-[0.8rem] font-700 uppercase tracking-[0.16em] text-bone hover:border-gold"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
