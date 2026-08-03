import { vipPlans } from "@/config/server";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const sheets: Record<string, string> = {
  bronze: "bronze-sheet",
  silver: "silver-sheet",
  gold: "gold-sheet",
};

/** Insígnias metálicas: placas cravadas em bronze, prata e ouro em vez de cards SaaS. */
export function VipPlansGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {vipPlans.map((plan) => (
        <li
          key={plan.id}
          className={cn(
            "plate plate-cut relative isolate flex flex-col gap-4 p-6 transition-transform duration-200 hover:-translate-y-1",
            plan.featured && "border-gold/60",
          )}
        >
          <span aria-hidden="true" className={cn("absolute inset-0 -z-10 opacity-45", sheets[plan.id])} />
          <span aria-hidden="true" className="grain-layer pointer-events-none absolute inset-0 -z-10" />

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <h3 className="ceremonial min-w-0 text-lg text-gold-soft">{plan.name}</h3>
            {plan.featured ? (
              <span className="shrink-0 border border-gold/60 bg-obsidian/70 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-gold">
                Mais escolhido
              </span>
            ) : null}
          </div>

          <div className="flex items-baseline gap-2 border-y border-gold/20 py-3">
            <span className="data-text text-2xl text-bone">{currency.format(plan.price)}</span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ash">
              / {plan.durationDays} dias
            </span>
          </div>

          <ul className="flex flex-col gap-2 text-sm text-parchment/85">
            {[`Experiência: ${plan.experience}`, `Drop: ${plan.drop}`, plan.note].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="mt-auto font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ash">
            &gt; benefícios complementares antes do lançamento
          </p>
        </li>
      ))}
    </ul>
  );
}
