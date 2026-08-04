import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const schema = z.object({
  accountId: z.string().trim().min(4, "Informe seu usuário.").max(10),
  password: z.string().min(8, "Informe sua senha da Área do Jogador (mínimo 8 caracteres)."),
});

const title = "Entrar — MU Kame";
const description = "Acesse sua conta do MU Kame para consultar personagens, VIP e downloads.";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/entrar" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/entrar" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/entrar" }) as { redirect?: string };
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [values, setValues] = useState({ accountId: "", password: "" });
  const [errors, setErrors] = useState<{ accountId?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: search.redirect || "/area-do-jogador" });
    }
  }, [isAuthenticated, navigate, search.redirect]);

  const fieldClass =
    "min-h-[46px] w-full border border-bronze/60 bg-obsidian/70 px-4 font-mono text-[0.9rem] text-bone placeholder:text-ash focus-visible:border-gold disabled:opacity-50";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: { accountId?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "accountId" | "password";
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    
    setErrors({});
    setSubmitting(true);
    
    try {
      await login(parsed.data);
      toast.success("Bem-vindo de volta!");
      navigate({ to: search.redirect || "/area-do-jogador" });
    } catch (error: any) {
      toast.error(error.message || "Login ou senha inválidos.");
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
            <label htmlFor="login-user" className="text-sm font-medium text-ivory">Login</label>
            <input
              id="login-user"
              value={values.accountId}
              onChange={(e) => setValues((v) => ({ ...v, accountId: e.target.value.toLowerCase() }))}
              aria-invalid={Boolean(errors.accountId)}
              aria-describedby={errors.accountId ? "login-user-error" : undefined}
              className={fieldClass}
              autoComplete="username"
              disabled={submitting}
            />
            {errors.accountId ? <p id="login-user-error" className="text-xs text-danger">{errors.accountId}</p> : null}
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
                disabled={submitting}
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
            {submitting ? "Autenticando…" : "Entrar"}
          </ActionButton>

          <p className="text-sm text-mist text-center">
            <Link 
              to="/esqueci-minha-senha"
              className="inline-block py-2 px-4 text-ash/80 hover:text-gold focus-visible:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 transition-all text-xs font-medium tracking-wide"
            >
              Esqueci minha senha
            </Link>
          </p>


          <p className="text-sm text-mist text-center border-t border-white/5 pt-4">
            Ainda não tem conta? <Link to="/criar-conta" className="text-gold hover:text-gold-soft font-semibold">Criar conta</Link>
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
