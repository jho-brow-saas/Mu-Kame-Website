import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, PageHero } from "@/components/layout/SiteLayout";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { Eye, EyeOff, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const schema = z
  .object({
    accountId: z
      .string()
      .trim()
      .min(4, "O login precisa ter no mínimo 4 caracteres.")
      .max(10, "O login precisa ter no máximo 10 caracteres.")
      .regex(/^[a-z0-9_]+$/, "Use apenas minúsculas, números e underscore (_).")
      .transform(v => v.toLowerCase()),
    displayName: z
      .string()
      .trim()
      .min(3, "O nome precisa ter no mínimo 3 caracteres.")
      .max(10, "O nome precisa ter no máximo 10 caracteres."),
    email: z.string().trim().email("Informe um e-mail válido.").max(50, "Máximo 50 caracteres."),
    gamePassword: z
      .string()
      .min(4, "A senha do jogo precisa ter no mínimo 4 caracteres.")
      .max(10, "A senha do jogo precisa ter no máximo 10 caracteres."),
    confirmGamePassword: z.string(),
    password: z
      .string()
      .min(12, "A senha do portal precisa ter no mínimo 12 caracteres.")
      .max(128),
    confirmPassword: z.string(),
    acceptRules: z.literal(true, { message: "É necessário aceitar as regras." }),
  })
  .refine((data) => data.gamePassword === data.confirmGamePassword, {
    path: ["confirmGamePassword"],
    message: "As senhas do jogo não coincidem.",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas do portal não coincidem.",
  });

type Errors = Partial<Record<keyof z.input<typeof schema>, string>>;

const title = "Criar conta — MU Kame";
const description = "Crie sua conta no MU Kame e prepare-se para o lançamento da Season 6.15 em 01/09/2026.";

export const Route = createFileRoute("/criar-conta")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://novo.mukame.online/criar-conta" },
    ],
    links: [{ rel: "canonical", href: "https://novo.mukame.online/criar-conta" }],
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
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({ 
    accountId: "", 
    displayName: "",
    email: "", 
    gamePassword: "", 
    confirmGamePassword: "",
    password: "", 
    confirmPassword: "", 
    acceptRules: false 
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showGamePassword, setShowGamePassword] = useState(false);
  const [showPortalPassword, setShowPortalPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(values.password);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setErrors({});
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
    
    setSubmitting(true);
    try {
      await register({
        accountId: parsed.data.accountId,
        displayName: parsed.data.displayName,
        email: parsed.data.email,
        gamePassword: parsed.data.gamePassword,
        password: parsed.data.password,
      });
      toast.success("Conta criada com sucesso!");
      
      // Limpa campos sensíveis e redireciona
      setValues(v => ({ 
        ...v, 
        gamePassword: "", 
        confirmGamePassword: "", 
        password: "", 
        confirmPassword: "" 
      }));
      
      navigate({ to: "/entrar" });
    } catch (error: any) {
      if (error.code === "REGISTRATION_FAILED") {
        toast.error("Não foi possível criar a conta. O login ou e-mail pode já estar em uso.");
      } else {
        toast.error(error.message || "Não foi possível concluir o cadastro.");
      }
    } finally {
      setSubmitting(false);
    }

  }

  const fieldClass =
    "min-h-[46px] w-full border border-bronze/60 bg-obsidian/70 px-4 font-mono text-[0.9rem] text-bone placeholder:text-ash focus-visible:border-gold disabled:opacity-50";

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Conta"
        title="Criar conta no MU Kame"
        description="Escolha seu usuário, defina uma senha segura e aceite as regras do servidor."
      />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} noValidate className="surface-card flex flex-col gap-5 p-6 sm:p-8">
          
          <div className="flex flex-col gap-4 p-4 border border-gold/10 bg-gold/5 plate-cut-soft mb-2">
            <div className="flex gap-3">
              <Info className="size-5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-parchment/80 leading-relaxed italic">
                “Sua senha do jogo possui limite de 10 caracteres e será usada no cliente do MU. A senha da Área do Jogador é separada e deve possuir no mínimo 12 caracteres.”
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="accountId" className="text-sm font-medium text-ivory">Login</label>
              <input
                id="accountId"
                value={values.accountId}
                onChange={(e) => setValues((v) => ({ ...v, accountId: e.target.value.toLowerCase() }))}
                aria-invalid={Boolean(errors.accountId)}
                aria-describedby={errors.accountId ? "accountId-error" : undefined}
                className={fieldClass}
                autoComplete="username"
                disabled={submitting}
              />
              {errors.accountId ? <p id="accountId-error" className="text-xs text-danger">{errors.accountId}</p> : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="displayName" className="text-sm font-medium text-ivory">Nome Exibido</label>
              <input
                id="displayName"
                value={values.displayName}
                onChange={(e) => setValues((v) => ({ ...v, displayName: e.target.value }))}
                aria-invalid={Boolean(errors.displayName)}
                aria-describedby={errors.displayName ? "displayName-error" : undefined}
                className={fieldClass}
                disabled={submitting}
              />
              {errors.displayName ? <p id="displayName-error" className="text-xs text-danger">{errors.displayName}</p> : null}
            </div>
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
              disabled={submitting}
            />
            {errors.email ? <p id="email-error" className="text-xs text-danger">{errors.email}</p> : null}
          </div>

          <div className="rule-draw h-px w-full bg-gold/10 my-2" />

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="gamePassword" className="text-sm font-medium text-gold-soft">Senha do Jogo (MU)</label>
              <div className="relative">
                <input
                  id="gamePassword"
                  type={showGamePassword ? "text" : "password"}
                  value={values.gamePassword}
                  onChange={(e) => setValues((v) => ({ ...v, gamePassword: e.target.value }))}
                  aria-invalid={Boolean(errors.gamePassword)}
                  aria-describedby={errors.gamePassword ? "gamePassword-error" : undefined}
                  className={cn(fieldClass, "pr-14")}
                  autoComplete="new-password"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowGamePassword((s) => !s)}
                  aria-label={showGamePassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-mist"
                >
                  {showGamePassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {errors.gamePassword ? <p id="gamePassword-error" className="text-xs text-danger">{errors.gamePassword}</p> : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmGamePassword" className="text-sm font-medium text-gold-soft">Confirmar Senha do Jogo</label>
              <input
                id="confirmGamePassword"
                type={showGamePassword ? "text" : "password"}
                value={values.confirmGamePassword}
                onChange={(e) => setValues((v) => ({ ...v, confirmGamePassword: e.target.value }))}
                aria-invalid={Boolean(errors.confirmGamePassword)}
                aria-describedby={errors.confirmGamePassword ? "confirmGame-error" : undefined}
                className={fieldClass}
                autoComplete="new-password"
                disabled={submitting}
              />
              {errors.confirmGamePassword ? <p id="confirmGame-error" className="text-xs text-danger">{errors.confirmGamePassword}</p> : null}
            </div>
          </div>

          <div className="rule-draw h-px w-full bg-gold/10 my-2" />

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-ivory">Senha da Área do Jogador</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPortalPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : "password-strength"}
                  className={cn(fieldClass, "pr-14")}
                  autoComplete="new-password"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPortalPassword((s) => !s)}
                  aria-label={showPortalPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-mist"
                >
                  {showPortalPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              <p id="password-strength" className="text-[10px] text-graylight uppercase tracking-wider">
                Força da Área: {strengthLabels[strength]}
              </p>
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={cn("h-0.5 flex-1", index < strength ? "bg-gold" : "bg-white/10")}
                  />
                ))}
              </div>
              {errors.password ? <p id="password-error" className="text-xs text-danger">{errors.password}</p> : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-ivory">Confirmar Senha da Área</label>
              <input
                id="confirmPassword"
                type={showPortalPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                className={fieldClass}
                autoComplete="new-password"
                disabled={submitting}
              />
              {errors.confirmPassword ? <p id="confirm-error" className="text-xs text-danger">{errors.confirmPassword}</p> : null}
            </div>
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
            {submitting ? "Forjando conta…" : "Criar conta"}
          </ActionButton>

          <p className="text-sm text-mist text-center border-t border-white/5 pt-4">
            Já tem conta? <Link to="/entrar" className="text-gold hover:text-gold-soft font-semibold">Entrar</Link>
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
