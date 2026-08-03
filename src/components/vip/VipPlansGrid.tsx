import { vipPlans } from "@/config/server";
import { TagBadge } from "@/components/ui-kit/Cards";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function VipPlansGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {vipPlans.map((plan) => (
        <li
          key={plan.id}
          className={cn(
            "surface-card flex flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1",
            plan.featured && "border-gold/40 shadow-[0_0_32px_rgb(211_168_75_/_12%)]",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl text-gold-soft">{plan.name}</h3>
            {plan.featured ? <TagBadge tone="gold">Mais escolhido</TagBadge> : null}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-ivory">{currency.format(plan.price)}</span>
            <span className="text-sm text-graylight">/ {plan.durationDays} dias</span>
          </div>

          <ul className="flex flex-col gap-2 text-sm text-mist">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-jade" aria-hidden="true" />
              Experiência: {plan.experience}
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-jade" aria-hidden="true" />
              Drop: {plan.drop}
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-jade" aria-hidden="true" />
              {plan.note}
            </li>
          </ul>

          <p className="mt-auto text-xs text-graylight">
            Os benefícios complementares serão divulgados antes do lançamento.
          </p>
        </li>
      ))}
    </ul>
  );
}
