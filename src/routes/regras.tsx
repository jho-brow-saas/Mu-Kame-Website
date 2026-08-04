import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { useRules, SEVERITY_LABELS } from "@/hooks/use-rules";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui-kit/States";
import { TagBadge } from "@/components/ui-kit/Cards";

const title = "Regras — MU Kame";
const description = "Regras oficiais do MU Kame: conduta, uso de programas de terceiros, comércio, guilds e punições.";

export const Route = createFileRoute("/regras")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/regras" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/regras" }],
  }),
  component: RegrasPage,
});

function RegrasPage() {
  const { rules, isPending, isError, refetch } = useRules();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Comunidade"
        title="Regras do servidor"
        description="Jogue limpo. As regras existem para manter a competição justa e o continente saudável."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {isPending ? <LoadingState label="Carregando regras oficiais..." /> : null}
        
        {isError ? (
          <ErrorState 
            description="Não foi possível carregar as regras da API." 
            onRetry={() => void refetch()} 
          />
        ) : null}

        {!isPending && !isError && rules.length === 0 ? (
          <EmptyState 
            title="Nenhuma regra definida" 
            description="As regras oficiais serão publicadas em breve." 
          />
        ) : null}

        <ol className="flex flex-col gap-6">
          {rules.map((rule) => (
            <li key={rule.id} className="surface-card p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 className="card-title text-ivory">{rule.title}</h2>
                <TagBadge 
                  tone={
                    rule.severity === "critical" ? "danger" : 
                    rule.severity === "high" ? "warning" : 
                    rule.severity === "medium" ? "primary" : "muted"
                  }
                >
                  {SEVERITY_LABELS[rule.severity] || rule.severity}
                </TagBadge>
              </div>
              <p className="mb-4 text-[0.95rem] font-medium leading-relaxed text-gold-soft/90">
                {rule.summary}
              </p>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-mist">
                {rule.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span aria-hidden="true" className="text-gold-soft">
                      •
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
