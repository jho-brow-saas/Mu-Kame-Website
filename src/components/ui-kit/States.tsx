import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
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
    <div className={cn("surface-card flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      <span className="flex size-12 items-center justify-center rounded-full border border-jade/25 bg-jade/10">
        <Sparkles className="size-5 text-jade" aria-hidden="true" />
      </span>
      <h3 className="card-title text-ivory">{title}</h3>
      {description ? <p className="max-w-md text-sm leading-relaxed text-mist">{description}</p> : null}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Carregando informações…" }: { label?: string }) {
  return (
    <div className="surface-card flex items-center justify-center gap-3 px-6 py-12 text-sm text-mist" role="status">
      <Loader2 className="size-4 animate-spin text-jade" aria-hidden="true" />
      {label}
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
    <div className="surface-card flex flex-col items-center gap-3 border-danger/25 px-6 py-12 text-center">
      <AlertTriangle className="size-6 text-danger" aria-hidden="true" />
      <h3 className="card-title text-ivory">{title}</h3>
      <p className="max-w-md text-sm text-mist">{description}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="min-h-[44px] rounded-xl border border-white/15 px-5 text-sm font-semibold text-ivory hover:border-jade/50"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
