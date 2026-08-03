import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { api } from "@/services/api";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, "O usuário precisa ter no mínimo 4 caracteres.")
      .max(10, "O usuário precisa ter no máximo 10 caracteres.")
      .regex(/^[a-zA-Z0-9]+$/, "Use apenas letras e números."),
    email: z.string().trim().email("Informe um e-mail válido.").max(255),
    password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres.").max(20),
    confirmPassword: z.string(),
    acceptRules: z.literal(true, { message: "É necessário aceitar as regras." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

type Errors = Partial<Record<"username" | "email" | "password" | "confirmPassword" | "acceptRules", string>>;

const title = "Criar conta — MU Kame";
const description = "Crie sua conta no MU Kame e prepare-se para o lançamento da Season 6.15 em 01/09/2026.";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/cadastro" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/cadastro" }],
  }),
  component: CadastroPage,
});

function passwordStrength(value: string) {
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  return Math.min(score, 4);
}

const strengthLabels = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];

function CadastroPage() {
  const [values, setValues] = useState({ username: "", email: "", password: "", confirmPassword: "", acceptRules: false });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  const strength = passwordStrength(values.password);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setFeedback(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await api.register({
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setFeedback({ type: "ok", message: result.message });
      setValues({ username: "", email: "", password: "", confirmPassword: "", acceptRules: false });
    } catch {
      setFeedback({ type: "error", message: "Não foi possível concluir o cadastro. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "min-h-[46px] w-full border border-bronze/60 bg-obsidian/70 px-4 font-mono text-[0.9rem] text-bone placeholder:text-ash focus-visible:border-gold";

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Conta"
        title="Criar conta no MU Kame"
        description="Escolha seu usuário, defina uma senha segura e aceite as regras do servidor."
      />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} noValidate className="surface-card flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium text-ivory">Usuário</label>
            <input
              id="username"
              value={values.username}
              onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
              className={fieldClass}
              autoComplete="username"
            />
            {errors.username ? <p id="username-error" className="text-xs text-danger">{errors.username}</p> : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-ivory">E-mail</label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass}
              autoComplete="email"
            />
            {errors.email ? <p id="email-error" className="text-xs text-danger">{errors.email}</p> : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-ivory">Senha</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : "password-strength"}
                className={cn(fieldClass, "pr-14")}
                autoComplete="new-password"
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
            <p id="password-strength" className="text-xs text-graylight">
              Força da senha: {strengthLabels[strength]}
            </p>
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={cn("h-1 flex-1", index < strength ? "bg-gold" : "bg-white/10")}
                />
              ))}
            </div>
            {errors.password ? <p id="password-error" className="text-xs text-danger">{errors.password}</p> : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-ivory">Confirmar senha</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
              className={fieldClass}
              autoComplete="new-password"
            />
            {errors.confirmPassword ? <p id="confirm-error" className="text-xs text-danger">{errors.confirmPassword}</p> : null}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="acceptRules" className="flex items-start gap-3 text-sm text-mist">
              <input
                id="acceptRules"
                type="checkbox"
                checked={values.acceptRules}
                onChange={(e) => setValues((v) => ({ ...v, acceptRules: e.target.checked }))}
                className="mt-1 size-4 accent-[color:var(--gold)]"
              />
              <span>
                Li e aceito as <Link to="/regras" className="text-gold hover:text-gold-soft">regras do servidor</Link>.
              </span>
            </label>
            {errors.acceptRules ? <p className="text-xs text-danger">{errors.acceptRules}</p> : null}
          </div>

          <ActionButton type="submit" disabled={submitting}>
            {submitting ? "Enviando…" : "Criar conta"}
          </ActionButton>

          {feedback ? (
            <p
              role="status"
              className={cn("text-sm", feedback.type === "ok" ? "text-success" : "text-danger")}
            >
              {feedback.message}
            </p>
          ) : null}

          <p className="text-sm text-mist">
            Já tem conta? <Link to="/login" className="text-gold hover:text-gold-soft">Entrar</Link>
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
