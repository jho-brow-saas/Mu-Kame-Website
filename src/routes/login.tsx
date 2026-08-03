import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  username: z.string().trim().min(4, "Informe seu usuário.").max(10),
  password: z.string().min(6, "Informe sua senha.").max(20),
});

const title = "Entrar — MU Kame";
const description = "Acesse sua conta do MU Kame para consultar personagens, VIP e downloads.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/login" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  const fieldClass =
    "min-h-[44px] w-full border border-white/12 bg-[color:var(--surface)]/70 px-4 text-base text-ivory placeholder:text-graylight";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setFeedback(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: { username?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "username" | "password";
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await api.login(parsed.data);
      setFeedback({ type: "ok", message: result.message });
    } catch {
      setFeedback({ type: "error", message: "Login ou senha inválidos." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Conta" title="Entrar" description="Acesse a área do jogador do MU Kame." />
      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} noValidate className="surface-card flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="login-user" className="text-sm font-medium text-ivory">Usuário</label>
            <input
              id="login-user"
              value={values.username}
              onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "login-user-error" : undefined}
              className={fieldClass}
              autoComplete="username"
            />
            {errors.username ? <p id="login-user-error" className="text-xs text-danger">{errors.username}</p> : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-sm font-medium text-ivory">Senha</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                className={cn(fieldClass, "pr-14")}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-mist"
              >
                {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
            {errors.password ? <p id="login-password-error" className="text-xs text-danger">{errors.password}</p> : null}
          </div>

          <ActionButton type="submit" disabled={submitting}>
            {submitting ? "Entrando…" : "Entrar"}
          </ActionButton>

          {feedback ? (
            <p role="status" className={cn("text-sm", feedback.type === "ok" ? "text-success" : "text-danger")}>
              {feedback.message}
            </p>
          ) : null}

          <p className="text-sm text-mist">
            Ainda não tem conta? <Link to="/cadastro" className="text-gold hover:text-gold-soft">Criar conta</Link>
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
