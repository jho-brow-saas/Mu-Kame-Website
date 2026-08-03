import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { ActionAnchor, ActionButton } from "@/components/ui-kit/Buttons";
import { faqItems, serverConfig, whatsappLink } from "@/config/server";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(60),
  email: z.string().trim().email("Informe um e-mail válido.").max(255),
  subject: z.string().trim().min(4, "Descreva o assunto.").max(120),
  message: z.string().trim().min(20, "Detalhe sua solicitação (mínimo 20 caracteres).").max(1000),
});

type Field = keyof z.infer<typeof schema>;

const title = "Suporte — MU Kame";
const description = "Suporte oficial do MU Kame pelo WhatsApp +55 31 99086-6048, com perguntas frequentes e formulário de atendimento.";

export const Route = createFileRoute("/suporte")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/suporte" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/suporte" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: SuportePage,
});

const emptyValues = { name: "", email: "", subject: "", message: "" };

function SuportePage() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const fieldClass =
    "min-h-[44px] w-full border border-white/12 bg-[color:var(--surface)]/70 px-4 py-3 text-base text-ivory placeholder:text-graylight";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setSent(false);
      return;
    }
    setErrors({});
    setValues(emptyValues);
    setSent(true);
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ajuda"
        title="Suporte MU Kame"
        description={`Atendimento oficial pelo WhatsApp ${serverConfig.supportWhatsAppLabel}.`}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="surface-card flex flex-col gap-4 p-6">
            <h2 className="card-title text-ivory">Canal oficial</h2>
            <p className="text-sm leading-relaxed text-mist">
              O WhatsApp é o canal mais rápido para dúvidas sobre conta, VIP, downloads e denúncias. Nunca informe sua
              senha para ninguém — a equipe jamais solicita.
            </p>
            <ActionAnchor href={whatsappLink} target="_blank" rel="noreferrer" className="mt-auto self-start">
              <MessageCircle className="size-4" aria-hidden="true" />
              {serverConfig.supportWhatsAppLabel}
            </ActionAnchor>
          </div>

          <form onSubmit={handleSubmit} noValidate className="surface-card flex flex-col gap-4 p-6">
            <h2 className="card-title text-ivory">Enviar mensagem</h2>
            {(
              [
                { id: "name", label: "Nome", type: "text" },
                { id: "email", label: "E-mail", type: "email" },
                { id: "subject", label: "Assunto", type: "text" },
              ] as Array<{ id: Field; label: string; type: string }>
            ).map((field) => (
              <div key={field.id} className="flex flex-col gap-1">
                <label htmlFor={field.id} className="text-sm font-medium text-ivory">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={values[field.id]}
                  onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                  aria-invalid={Boolean(errors[field.id])}
                  aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                  className={fieldClass}
                />
                {errors[field.id] ? (
                  <p id={`${field.id}-error`} className="text-xs text-danger">
                    {errors[field.id]}
                  </p>
                ) : null}
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-sm font-medium text-ivory">
                Mensagem
              </label>
              <textarea
                id="message"
                rows={5}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(fieldClass, "resize-y")}
              />
              {errors.message ? (
                <p id="message-error" className="text-xs text-danger">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <ActionButton type="submit">Enviar mensagem</ActionButton>
            {sent ? (
              <p role="status" className="text-sm text-success">
                Mensagem registrada. O envio automático será ativado com a API oficial — use o WhatsApp para urgências.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" className="mb-6" />
        <ul className="flex flex-col gap-3">
          {faqItems.map((item) => (
            <li key={item.q} className="surface-card px-5 py-4">
              <h3 className="mb-1 text-sm font-semibold text-ivory">{item.q}</h3>
              <p className="text-sm leading-relaxed text-mist">{item.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
