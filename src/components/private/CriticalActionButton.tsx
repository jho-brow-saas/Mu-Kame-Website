import { useEffect, useId, useRef, useState } from "react";
import { ActionButton } from "@/components/ui-kit/Buttons";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileClock, KeyRound, Loader2, X } from "lucide-react";
import type { ApiResult } from "@/types/api";

export type CriticalActionResult = ApiResult<{ message?: string }> | ApiResult<unknown>;

/**
 * Botão de ação crítica com fluxo obrigatório:
 * confirmação -> justificativa -> reautenticação -> resultado.
 * Trava envio duplicado e avisa sobre registro em auditoria.
 *
 * AVISO: o bloqueio aqui é de interface. A API DEVE reexigir
 * reautenticação, permissão e justificativa no servidor.
 */
export function CriticalActionButton({
  label,
  title,
  description,
  confirmLabel = "Confirmar operação",
  destructive = true,
  disabled = false,
  disabledHint,
  requiresReason = true,
  requiresReauth = true,
  onConfirm,
  className,
}: {
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  disabled?: boolean;
  disabledHint?: string;
  requiresReason?: boolean;
  requiresReauth?: boolean;
  onConfirm: (input: { reason: string; password: string }) => Promise<CriticalActionResult>;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "error"; message: string } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting]);

  const reasonInvalid = requiresReason && reason.trim().length < 10;
  const passwordInvalid = requiresReauth && password.trim().length < 4;
  const blocked = submitting || reasonInvalid || passwordInvalid;

  async function handleConfirm() {
    if (blocked) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await onConfirm({ reason: reason.trim(), password });
      if (result.ok) {
        setFeedback({ tone: "ok", message: "Operação concluída e registrada na auditoria." });
        setReason("");
      } else {
        setFeedback({ tone: "error", message: result.error.message });
      }
    } catch {
      setFeedback({ tone: "error", message: "Falha inesperada ao contactar a API." });
    } finally {
      setPassword("");
      setSubmitting(false);
    }
  }

  return (
    <>
      <ActionButton
        variant={destructive ? "danger" : "secondary"}
        onClick={() => {
          setFeedback(null);
          setOpen(true);
        }}
        disabled={disabled}
        title={disabled ? disabledHint : undefined}
        className={cn("w-full", className)}
      >
        {label}
      </ActionButton>

      {open ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Fechar confirmação"
            className="absolute inset-0 bg-obsidian/85"
            onClick={() => (submitting ? null : setOpen(false))}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${baseId}-title`}
            tabIndex={-1}
            className="plate plate-cut inner-rule relative max-h-full w-full max-w-lg overflow-y-auto"
          >
            <div className="metal-sheet flex items-center justify-between gap-4 border-b border-gold/25 px-4 py-2.5">
              <span className="label-text flex items-center gap-2 text-gold-soft">
                <AlertTriangle className="size-3.5 text-crimson" aria-hidden="true" />
                Confirmação de operação
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="text-ash transition-colors hover:text-gold disabled:opacity-50"
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1">
                <h2 id={`${baseId}-title`} className="card-title uppercase text-bone">
                  {title}
                </h2>
                <p className="text-sm leading-relaxed text-parchment/85">{description}</p>
              </div>

              {requiresReason ? (
                <label className="flex flex-col gap-2">
                  <span className="label-text text-ash">Justificativa (obrigatória)</span>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={3}
                    maxLength={400}
                    className="border border-input bg-obsidian/70 px-3 py-2 font-sans text-sm text-bone outline-none focus-visible:border-gold"
                    placeholder="Descreva o motivo desta operação (mínimo 10 caracteres)."
                  />
                  {reasonInvalid ? (
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-crimson">
                      Informe pelo menos 10 caracteres.
                    </span>
                  ) : null}
                </label>
              ) : null}

              {requiresReauth ? (
                <label className="flex flex-col gap-2">
                  <span className="label-text flex items-center gap-2 text-ash">
                    <KeyRound className="size-3.5 text-bronze" aria-hidden="true" />
                    Reautenticação
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="border border-input bg-obsidian/70 px-3 py-2 font-mono text-sm text-bone outline-none focus-visible:border-gold"
                    placeholder="Senha da sua conta de comando"
                  />
                </label>
              ) : null}

              <p className="flex items-start gap-2 border border-mana/50 bg-mana/15 px-3 py-2 font-mono text-[0.68rem] leading-relaxed text-arcane">
                <FileClock className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                Esta operação será registrada na auditoria com autor, data, alvo e justificativa.
              </p>

              {feedback ? (
                <p
                  className={cn(
                    "border px-3 py-2 font-mono text-[0.7rem] leading-relaxed",
                    feedback.tone === "ok"
                      ? "border-gold/45 bg-bronze-dark/50 text-gold-soft"
                      : "border-crimson/60 bg-wine/30 text-bone",
                  )}
                  role="status"
                >
                  {feedback.message}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <ActionButton
                  variant={destructive ? "danger" : "primary"}
                  onClick={handleConfirm}
                  disabled={blocked}
                  className="flex-1"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                  {submitting ? "Enviando…" : confirmLabel}
                </ActionButton>
                <ActionButton variant="ghost" onClick={() => setOpen(false)} disabled={submitting} className="flex-1">
                  Cancelar
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
