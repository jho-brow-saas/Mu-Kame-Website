import { EmptyState, ErrorState, LoadingState } from "@/components/ui-kit/States";
import { ActionLink } from "@/components/ui-kit/Buttons";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import type { ApiError, LoadPhase } from "@/types/api";

export function BlockedState({
  title = "Acesso bloqueado",
  description = "Esta área exige sessão válida na API oficial do MU Kame.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="plate plate-cut inner-rule relative flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span aria-hidden="true" className="rune-grid absolute inset-0 opacity-40" />
      <span
        aria-hidden="true"
        className="silver-sheet relative flex size-12 items-center justify-center border border-gold/40"
        style={{ clipPath: "polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)" }}
      >
        <Lock className="size-5 text-gold-soft" aria-hidden="true" />
      </span>
      <h3 className="card-title relative uppercase text-bone">{title}</h3>
      <p className="relative max-w-md text-sm leading-relaxed text-parchment/80">{description}</p>
      <div className="relative">{action ?? <ActionLink to="/login" variant="secondary">Ir para o login</ActionLink>}</div>
    </div>
  );
}

/**
 * Renderiza o conteúdo apenas quando o recurso está pronto; caso contrário
 * mostra loading, vazio, erro ou bloqueado.
 */
export function ResourceGate({
  phase,
  error,
  onRetry,
  emptyTitle = "Nada por aqui ainda",
  emptyDescription = "Os dados aparecerão quando a API oficial for conectada.",
  loadingLabel,
  children,
}: {
  phase: LoadPhase;
  error?: ApiError | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingLabel?: string;
  children: ReactNode;
}) {
  if (phase === "loading") return <LoadingState {...(loadingLabel ? { label: loadingLabel } : {})} />;
  if (phase === "blocked") {
    return (
      <BlockedState
        description={error?.message ?? "Esta área exige sessão válida na API oficial do MU Kame."}
      />
    );
  }
  if (phase === "error") {
    return (
      <ErrorState
        description={error?.message ?? "Tente novamente em alguns instantes."}
        {...(onRetry ? { onRetry } : {})}
      />
    );
  }
  if (phase === "empty") return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <>{children}</>;
}
