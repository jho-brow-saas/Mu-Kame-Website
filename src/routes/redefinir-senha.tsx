import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/redefinir-senha")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t || t.length !== 64 || !/^[0-9a-fA-F]+$/.test(t)) {
      setIsTokenInvalid(true);
    } else {
      setToken(t);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || submitting) return;

    if (password.length < 12) {
      toast.error("A nova senha deve possuir no mínimo 12 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, password });
      setDone(true);
      setPassword("");
      setConfirmPassword("");
      // Limpa token da URL sem recarregar apenas após o sucesso
      window.history.replaceState({}, "", window.location.pathname);
    } catch (error: any) {
      if (error.code === "INVALID_RESET_TOKEN") {
        toast.error("Este link de recuperação é inválido, já foi utilizado ou expirou.");
      } else {
        toast.error(error.message || "Não foi possível atualizar a senha agora. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (isTokenInvalid) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Segurança" title="Link Inválido" description="Ocorreu um problema com seu acesso." />
        <section className="mx-auto max-w-md px-4 py-12 text-center">
          <div className="surface-card p-8 flex flex-col items-center gap-6">
            <ShieldAlert className="size-12 text-danger" />
            <p className="text-bone">Este link de recuperação é inválido.</p>
            <Link to="/esqueci-minha-senha" title="Tentar novamente">
              <ActionButton variant="ghost">Solicitar novo link</ActionButton>
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (done) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Segurança" title="Senha Atualizada" description="Seu acesso foi restaurado com sucesso." />
        <section className="mx-auto max-w-md px-4 py-12 text-center">
          <div className="surface-card p-8 flex flex-col items-center gap-6">
            <CheckCircle2 className="size-12 text-jade" />
            <div className="space-y-2">
              <h3 className="text-xl font-display text-bone">Tudo pronto!</h3>
              <p className="text-sm text-mist">Sua senha foi atualizada e todas as sessões anteriores foram encerradas por segurança.</p>
            </div>
            <Link to="/login" className="w-full">
              <ActionButton className="w-full">Entrar agora</ActionButton>
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const fieldClass = "min-h-[46px] w-full border border-bronze/60 bg-obsidian/70 px-4 font-mono text-[0.9rem] text-bone placeholder:text-ash focus-visible:border-gold disabled:opacity-50";

  return (
    <SiteLayout>
      <PageHero eyebrow="Segurança" title="Redefinir Senha" description="Escolha uma nova senha forte para sua Área do Jogador." />
      <section className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={handleSubmit} className="surface-card p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ivory">Nova Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(fieldClass, "pr-12")}
                placeholder="Mínimo 12 caracteres"
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 size-11 flex items-center justify-center text-ash hover:text-gold"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ivory">Confirmar Nova Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
              required
              disabled={submitting}
            />
          </div>

          <ActionButton type="submit" disabled={submitting}>
            {submitting ? "Atualizando..." : "Redefinir Senha"}
          </ActionButton>
        </form>
      </section>
    </SiteLayout>
  );
}
