import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useVip } from "@/hooks/use-vip";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-kit/States";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const sheets: Record<string, string> = {
  bronze: "bronze-sheet",
  silver: "silver-sheet",
  gold: "gold-sheet",
};

/** Insígnias metálicas: placas cravadas em bronze, prata e ouro em vez de cards SaaS. */
export function VipPlansGrid() {
  const { data, isPending, isError, refetch } = useVip();
  const plans = data?.plans ?? [];

  if (isPending) return <LoadingState label="Carregando planos VIP…" />;
  if (isError) return <ErrorState description="Não foi possível carregar os planos VIP." onRetry={() => void refetch()} />;
  if (plans.length === 0) return <EmptyState title="Nenhum plano disponível" description="Os planos VIP serão divulgados em breve." />;

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <li
          key={plan.id}
          className={cn(
            "plate plate-cut relative isolate flex flex-col gap-4 p-6 transition-transform duration-200 hover:-translate-y-1",
            plan.id === "gold" && "border-gold/60",
          )}
        >
          <span aria-hidden="true" className={cn("absolute inset-0 -z-10 opacity-45", sheets[plan.id] || "metal-sheet")} />
          <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0 -z-10" />

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <h3 className="ceremonial min-w-0 text-lg text-gold-soft">{plan.name}</h3>
            {plan.id === "gold" ? (
              <span className="shrink-0 border border-gold/60 bg-obsidian/70 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-gold">
                Mais escolhido
              </span>
            ) : null}
          </div>

          <div className="flex items-baseline gap-2 border-y border-gold/20 py-3">
            <span className="data-text text-2xl text-bone">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: plan.currency || "BRL" }).format(plan.price)}
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">
              / {plan.durationDays} dias
            </span>
          </div>

          <ul className="flex flex-col gap-2 text-sm text-parchment/85">
            {plan.benefits && plan.benefits.length > 0 ? (
              plan.benefits.map((benefit) => (
                <li key={benefit.id} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>{benefit.label}: {String(benefit.value)}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2 italic text-parchment/60">
                <span>Benefícios adicionais serão divulgados em breve.</span>
              </li>
            )}
          </ul>

          {!plan.available && (
            <p className="mt-auto font-mono text-[0.66rem] uppercase tracking-[0.12em] text-bronze">
              &gt; plano temporariamente indisponível
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
