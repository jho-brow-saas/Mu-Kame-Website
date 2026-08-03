import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { rulesSections } from "@/config/server";

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
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Comunidade"
        title="Regras do servidor"
        description="Jogue limpo. As regras existem para manter a competição justa e o continente saudável."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ol className="flex flex-col gap-4">
          {rulesSections.map((section) => (
            <li key={section.title} className="surface-card p-6">
              <h2 className="card-title mb-3 text-ivory">{section.title}</h2>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-mist">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-gold-soft">
                      •
                    </span>
                    {item}
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
