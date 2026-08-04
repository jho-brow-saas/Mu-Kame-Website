import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { ActionAnchor, ActionButton } from "@/components/ui-kit/Buttons";
import { useSocials } from "@/hooks/use-socials";
import { useFaq } from "@/hooks/use-faq";
import { serverConfig, whatsappLink } from "@/config/server";
import { cn } from "@/lib/utils";
import { MessageCircle, Instagram, Music2, Send } from "lucide-react";
const schema = z.object({
    name: z.string().trim().min(2, "Informe seu nome.").max(60),
    email: z.string().trim().email("Informe um e-mail válido.").max(255),
    subject: z.string().trim().min(4, "Descreva o assunto.").max(120),
    message: z.string().trim().min(20, "Detalhe sua solicitação (mínimo 20 caracteres).").max(1000),
});
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
        scripts: [],
    }),
    component: SuportePage,
});
const emptyValues = { name: "", email: "", subject: "", message: "" };
function SuportePage() {
    const { data: socials } = useSocials();
    const { faqs, categories, selectedCategory, setSelectedCategory, isPending } = useFaq();
    const [values, setValues] = useState(emptyValues);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);
    const fieldClass = "min-h-[46px] w-full border border-bronze/60 bg-obsidian/70 px-4 py-3 font-mono text-[0.9rem] text-bone placeholder:text-ash focus-visible:border-gold";
    function handleSubmit(event) {
        event.preventDefault();
        const parsed = schema.safeParse(values);
        if (!parsed.success) {
            const next = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0];
                if (key && !next[key])
                    next[key] = issue.message;
            }
            setErrors(next);
            setSent(false);
            return;
        }
        setErrors({});
        setValues(emptyValues);
        setSent(true);
    }
    return (<SiteLayout>
      <PageHero eyebrow="Ajuda" title="Suporte MU Kame" description={`Atendimento oficial pelo WhatsApp ${socials?.whatsapp.handle ?? serverConfig.supportWhatsAppLabel}.`}/>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="surface-card flex flex-col gap-4 p-6">
            <h2 className="card-title text-ivory">Canal oficial</h2>
            <p className="text-sm leading-relaxed text-mist">
              O WhatsApp é o canal mais rápido para dúvidas sobre conta, VIP, downloads e denúncias. Nunca informe sua
              senha para ninguém — a equipe jamais solicita.
            </p>
            <ActionAnchor href={socials?.whatsapp.url ?? whatsappLink} target="_blank" rel="noreferrer" className="mt-auto self-start">
              <MessageCircle className="size-4" aria-hidden="true"/>
              {socials?.whatsapp.handle ?? serverConfig.supportWhatsAppLabel}
            </ActionAnchor>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials?.instagram.available && (<ActionAnchor href={socials.instagram.url} target="_blank" rel="noreferrer" variant="ghost" className="flex-1">
                  <Instagram className="size-4" aria-hidden="true"/>
                  Instagram
                </ActionAnchor>)}
              {socials?.tiktok.available && (<ActionAnchor href={socials.tiktok.url} target="_blank" rel="noreferrer" variant="ghost" className="flex-1">
                  <Music2 className="size-4" aria-hidden="true"/>
                  TikTok
                </ActionAnchor>)}
              {socials?.discord.available && (<ActionAnchor href={socials.discord.url} target="_blank" rel="noreferrer" variant="ghost" className="flex-1">
                  <Send className="size-4" aria-hidden="true"/>
                  Discord
                </ActionAnchor>)}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="surface-card flex flex-col gap-4 p-6">
            <h2 className="card-title text-ivory">Enviar mensagem</h2>
            {[
            { id: "name", label: "Nome", type: "text" },
            { id: "email", label: "E-mail", type: "email" },
            { id: "subject", label: "Assunto", type: "text" },
        ].map((field) => (<div key={field.id} className="flex flex-col gap-1">
                <label htmlFor={field.id} className="text-sm font-medium text-ivory">
                  {field.label}
                </label>
                <input id={field.id} type={field.type} value={values[field.id]} onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))} aria-invalid={Boolean(errors[field.id])} aria-describedby={errors[field.id] ? `${field.id}-error` : undefined} className={fieldClass}/>
                {errors[field.id] ? (<p id={`${field.id}-error`} className="text-xs text-danger">
                    {errors[field.id]}
                  </p>) : null}
              </div>))}

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-sm font-medium text-ivory">
                Mensagem
              </label>
              <textarea id="message" rows={5} value={values.message} onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} className={cn(fieldClass, "resize-y")}/>
              {errors.message ? (<p id="message-error" className="text-xs text-danger">
                  {errors.message}
                </p>) : null}
            </div>

            <ActionButton type="submit">Enviar mensagem</ActionButton>
            {sent ? (<p role="status" className="text-sm text-success">
                Mensagem registrada. O envio automático será ativado com a API oficial — use o WhatsApp para urgências.
              </p>) : null}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" className="mb-6"/>
        
        {categories.length > 0 && (<div className="mb-6 flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory(null)} className={cn("border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider transition-colors", !selectedCategory
                ? "border-gold bg-gold/10 text-gold"
                : "border-bronze/30 text-ash hover:border-bronze")}>
              Todos
            </button>
            {categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={cn("border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider transition-colors", selectedCategory === cat
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-bronze/30 text-ash hover:border-bronze")}>
                {cat}
              </button>))}
          </div>)}

        <ul className="flex flex-col gap-3">
          {isPending && <li className="text-center py-8 text-ash animate-pulse">Consultando oráculo...</li>}
          {faqs.map((item) => (<li key={item.id} className="surface-card px-5 py-4">
              <p className="mb-1 italic text-gold-soft/70 text-[0.6rem] uppercase tracking-widest">{item.category}</p>
              <h3 className="mb-1 text-sm font-semibold text-ivory">{item.question}</h3>
              <p className="text-sm leading-relaxed text-mist">{item.answer}</p>
            </li>))}
          {!isPending && faqs.length === 0 && (<li className="text-center py-8 text-ash">Nenhuma pergunta encontrada nesta categoria.</li>)}
        </ul>
      </section>
    </SiteLayout>);
}
