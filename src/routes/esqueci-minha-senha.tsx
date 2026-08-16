import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/esqueci-minha-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar Senha — MU Kame" },
      { name: "description", content: "Solicite a recuperação de senha da sua conta no MU Kame." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/esqueci-minha-senha" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [loginOrEmail, setLoginOrEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginOrEmail.trim() || submitting) return;

    setSubmitting(true);
    try {
      await forgotPassword({ loginOrEmail });
      setDone(true);
    } catch (error: any) {
      // Sempre mostramos a mesma mensagem por segurança, a menos que seja erro de conexão
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Segurança" title="Recuperação Enviada" description="Verifique sua caixa de entrada e spam." />
        <section className="mx-auto max-w-md px-4 py-12">
          <div className="surface-card p-8 text-center flex flex-col items-center gap-6">
            <div className="size-16 bg-jade/10 border border-jade/20 plate-cut flex items-center justify-center">
              <CheckCircle2 className="size-8 text-jade" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display text-bone">Instruções enviadas</h3>
              <p className="text-sm text-mist leading-relaxed">
                Se os dados estiverem corretos, enviaremos as instruções de recuperação para o e-mail cadastrado.
              </p>
            </div>
            <Link to="/login" className="w-full">
              <ActionButton variant="ghost" className="w-full">
                Voltar para o Login
              </ActionButton>
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Segurança" title="Esqueci minha senha" description="Recupere o acesso à sua Área do Jogador." />
      <section className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={handleSubmit} className="surface-card p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="loginOrEmail" className="text-sm font-medium text-ivory">Login ou E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ash/40" />
              <input
                id="loginOrEmail"
                type="text"
                value={loginOrEmail}
                onChange={(e) => setLoginOrEmail(e.target.value)}
                placeholder="Ex: mukame_player"
                className="min-h-[46px] w-full border border-bronze/60 bg-obsidian/70 pl-11 pr-4 font-mono text-[0.9rem] text-bone placeholder:text-ash focus-visible:border-gold"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <ActionButton type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Solicitar Recuperação"}
          </ActionButton>

          <Link to="/login" className="flex items-center justify-center gap-2 text-xs text-ash hover:text-gold transition-colors">
            <ArrowLeft className="size-3" /> Voltar para o Login
          </Link>
        </form>
      </section>
    </SiteLayout>
  );
}
